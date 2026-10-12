import dns from 'dns';
import net from 'net';

export interface UrlGuardResult {
  valid: boolean;
  code?: 'INVALID_URL' | 'BLOCKED_HOST';
  message?: string;
  parsedUrl?: URL;
  resolvedIps?: string[];
}

export function isPrivateOrBlockedIp(ip: string): boolean {
  // Check for IPv4-mapped IPv6 (e.g., ::ffff:127.0.0.1 or ::ffff:7f00:1)
  const lowerIp = ip.toLowerCase().trim();
  if (lowerIp.startsWith('::ffff:')) {
    const v4Part = lowerIp.slice(7);
    if (net.isIPv4(v4Part)) {
      return isPrivateOrBlockedIp(v4Part);
    }
  }

  // IPv4 Checks
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) {
      return true;
    }
    const [a, b] = parts;

    // 0.0.0.0/8 (unspecified)
    if (a === 0) return true;
    // 127.0.0.0/8 (loopback)
    if (a === 127) return true;
    // 10.0.0.0/8 (private)
    if (a === 10) return true;
    // 172.16.0.0/12 (private: 172.16.0.0 to 172.31.255.255)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (private)
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 (link-local)
    if (a === 169 && b === 254) return true;
    // 224.0.0.0/4 (multicast) and 240.0.0.0/4 (reserved / broadcast)
    if (a >= 224) return true;

    return false;
  }

  // IPv6 Checks
  if (net.isIPv6(ip)) {
    const norm = lowerIp;
    // ::1 (loopback)
    if (norm === '::1' || norm === '0:0:0:0:0:0:0:1') return true;
    // :: (unspecified)
    if (norm === '::' || norm === '0:0:0:0:0:0:0:0') return true;
    // fc00::/7 (unique local: fc00:: to fdff::)
    if (/^f[cd][0-9a-f]{2}:/i.test(norm) || norm.startsWith('fc') || norm.startsWith('fd')) {
      return true;
    }
    // fe80::/10 (link-local: fe80:: to febf::)
    if (/^fe[89ab][0-9a-f]:/i.test(norm) || norm.startsWith('fe8') || norm.startsWith('fe9') || norm.startsWith('fea') || norm.startsWith('feb')) {
      return true;
    }

    return false;
  }

  // Not a recognizable IP format
  return true;
}

export async function validateSafeUrl(rawUrl: unknown): Promise<UrlGuardResult> {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return {
      valid: false,
      code: 'INVALID_URL',
      message: 'A valid public URL is required.',
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return {
      valid: false,
      code: 'INVALID_URL',
      message: 'That does not look like a web address.',
    };
  }

  // Protocol check: Only http and https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      valid: false,
      code: 'INVALID_URL',
      message: 'Only http and https protocols are supported.',
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Hostname string checks
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal')
  ) {
    return {
      valid: false,
      code: 'BLOCKED_HOST',
      message: 'For safety, AuraGaze will not fetch local or private addresses.',
    };
  }

  // DNS Lookup on all addresses
  try {
    const records = await dns.promises.lookup(hostname, { all: true });
    if (!records || records.length === 0) {
      return {
        valid: false,
        code: 'BLOCKED_HOST',
        message: 'Could not resolve the specified hostname.',
      };
    }

    const resolvedIps = records.map((r) => r.address);
    for (const record of records) {
      if (isPrivateOrBlockedIp(record.address)) {
        return {
          valid: false,
          code: 'BLOCKED_HOST',
          message: 'For safety, AuraGaze will not fetch local or private addresses.',
          resolvedIps,
        };
      }
    }

    return {
      valid: true,
      parsedUrl: parsed,
      resolvedIps,
    };
  } catch (err: unknown) {
    // If DNS resolution fails, check if hostname is already a raw literal IP
    if (net.isIP(hostname)) {
      if (isPrivateOrBlockedIp(hostname)) {
        return {
          valid: false,
          code: 'BLOCKED_HOST',
          message: 'For safety, AuraGaze will not fetch local or private addresses.',
        };
      }
    }

    return {
      valid: false,
      code: 'INVALID_URL',
      message: 'Unable to resolve destination address.',
    };
  }
}
