const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log(`Running Reader API tests against: ${BASE_URL}\n`);
  let failed = 0;

  async function check(name, testFn) {
    try {
      await testFn();
      console.log(`✔ PASS: ${name}`);
    } catch (err) {
      console.error(`✖ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. No url parameter
  await check('/api/reader (no url) returns 400 INVALID_URL', async () => {
    const res = await fetch(`${BASE_URL}/api/reader`);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (data.code !== 'INVALID_URL') throw new Error(`Expected code INVALID_URL, got ${data.code}`);
  });

  // 2. FTP scheme
  await check('url=ftp://example.com returns 400 INVALID_URL', async () => {
    const res = await fetch(`${BASE_URL}/api/reader?url=ftp://example.com`);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (data.code !== 'INVALID_URL') throw new Error(`Expected code INVALID_URL, got ${data.code}`);
  });

  // 3. Localhost
  await check('url=http://localhost:3000 returns 400 BLOCKED_HOST', async () => {
    const res = await fetch(`${BASE_URL}/api/reader?url=http://localhost:3000`);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (data.code !== 'BLOCKED_HOST') throw new Error(`Expected code BLOCKED_HOST, got ${data.code}`);
  });

  // 4. Link-local cloud metadata IP
  await check('url=http://169.254.169.254/ returns 400 BLOCKED_HOST', async () => {
    const res = await fetch(`${BASE_URL}/api/reader?url=http://169.254.169.254/`);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (data.code !== 'BLOCKED_HOST') throw new Error(`Expected code BLOCKED_HOST, got ${data.code}`);
  });

  // 5. Shortened loopback IP 127.1
  await check('url=http://127.1/ returns 400 BLOCKED_HOST', async () => {
    const res = await fetch(`${BASE_URL}/api/reader?url=http://127.1/`);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (data.code !== 'BLOCKED_HOST') throw new Error(`Expected code BLOCKED_HOST, got ${data.code}`);
  });

  // 6 & 7. Wikipedia Live Article
  await check('url=https://en.wikipedia.org/wiki/Photosynthesis returns 200 with sanitized article', async () => {
    const target = encodeURIComponent('https://en.wikipedia.org/wiki/Photosynthesis');
    const res = await fetch(`${BASE_URL}/api/reader?url=${target}`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (!data.ok) throw new Error('Expected ok: true in response');
    if (!data.title || !data.title.includes('Photosynthesis')) {
      throw new Error(`Expected title containing Photosynthesis, got: "${data.title}"`);
    }
    if (typeof data.textLength !== 'number' || data.textLength <= 5000) {
      throw new Error(`Expected textLength > 5000, got ${data.textLength}`);
    }

    const htmlLower = (data.contentHtml || '').toLowerCase();
    if (htmlLower.includes('<script')) {
      throw new Error('Found forbidden <script tag in contentHtml');
    }
    if (htmlLower.includes('onclick')) {
      throw new Error('Found forbidden onclick attribute in contentHtml');
    }
  });

  console.log(`\nTests completed: ${failed === 0 ? 'ALL PASSED' : `${failed} FAILED`}`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
