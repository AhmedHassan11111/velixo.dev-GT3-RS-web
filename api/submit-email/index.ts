import { Resend } from 'resend';
import { isValidEmail, normalizeEmail } from './lib/validate';
import { sanitizeInput, sanitizeEmail } from './lib/sanitize';
import { rateLimiter } from './lib/rate-limit';

console.log('[submit-email] Environment check:', {
  hasResendKey: !!process.env.RESEND_API_KEY,
  hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
  hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
  upstashUrl: process.env.UPSTASH_REDIS_REST_URL?.replace(/\/\/.*@/, '//***@') || 'missing',
  allowedOrigins: process.env.ALLOWED_ORIGINS || 'not set (allowing all)',
});

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

interface SubmitEmailRequest {
  email: string;
  honeypot?: string;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('cf-connecting-ip') || 'unknown';
}

function checkCors(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
}

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeout]);
}

export async function handleSubmitEmail(request: Request): Promise<Response> {
  const origin = request.headers.get('origin');

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  if (!checkCors(request)) {
    return new Response(
      JSON.stringify({ status: 'error', message: 'Origin not allowed' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ status: 'error', message: 'Method not allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  let body: SubmitEmailRequest;
  try {
    body = (await request.json()) as SubmitEmailRequest;
  } catch {
    return new Response(
      JSON.stringify({ status: 'validation_failed', message: 'Invalid request body' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  const ip = getClientIp(request);
  const rateLimit = await rateLimiter.check(ip);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        status: 'rate_limited',
        message: 'Too many submissions. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  if (body.honeypot && body.honeypot.trim() !== '') {
    return new Response(
      JSON.stringify({ status: 'bot_rejected', message: 'Invalid submission.' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  if (!body.email || !isValidEmail(body.email)) {
    return new Response(
      JSON.stringify({ status: 'validation_failed', message: 'Please enter a valid email address.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  const sanitizedEmail = sanitizeEmail(normalizeEmail(body.email));

  let resend;
  try {
    resend = getResendClient();
  } catch (error) {
    console.error('Email service configuration error:', error);
    return new Response(
      JSON.stringify({ status: 'error', message: 'Email service is not configured.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  try {
    await withTimeout(
      resend.emails.send({
        from: 'Porsche GT3 RS Showcase <noreply@velixo.io>',
        to: ['contact@velixo.io'],
        subject: 'New Email Submission',
        text: `New submission: ${sanitizedEmail}`,
      }),
      8000
    );
  } catch (error) {
    console.error('Failed to send email:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: 'Failed to process submission.',
        detail: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      }
    );
  }

  return new Response(
    JSON.stringify({ status: 'accepted', message: 'Thank you for subscribing.' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    }
  );
}

export default {
  fetch: async (request: Request): Promise<Response> => {
    try {
      return await handleSubmitEmail(request);
    } catch (error) {
      console.error('Unhandled error in submit-email:', error);
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Internal server error.',
          detail: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
