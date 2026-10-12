export const ERROR_MESSAGES: Record<string, string> = {
  INVALID_URL: 'That does not look like a web address.',
  BLOCKED_HOST: 'For safety, AuraGaze will not fetch local or private addresses.',
  UPSTREAM_ERROR: 'That site refused the request or returned an error.',
  NOT_HTML: 'That link is not a web page.',
  EMPTY_CONTENT: 'This page builds itself with JavaScript, so there is no article text to extract.',
  TOO_LARGE: 'That page is too large to process.',
  TIMEOUT: 'The site took too long to respond.',
};

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Try the demo page.';

export function getFriendlyErrorMessage(errorCode?: string | null): string {
  if (!errorCode) return DEFAULT_ERROR_MESSAGE;
  return ERROR_MESSAGES[errorCode] || DEFAULT_ERROR_MESSAGE;
}
