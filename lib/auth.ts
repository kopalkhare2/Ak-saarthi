/**
 * Shared authentication helpers.
 * Single source of truth for JWT_SECRET — never hardcode secrets in route files.
 */

const DEV_FALLBACK = 'ak-saarthi-dev-only-secret-key-do-not-use-in-prod';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[FATAL] JWT_SECRET environment variable is not set. ' +
      'Set it in your hosting platform before deploying to production.'
    );
  }

  // Dev-only fallback
  console.warn(
    '⚠️  JWT_SECRET is not set — using development fallback. ' +
    'Set JWT_SECRET in .env for production.'
  );
  return DEV_FALLBACK;
}
