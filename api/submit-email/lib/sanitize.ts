export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/script/gi, '')
    .replace(/(union|select|insert|update|delete|drop|create|alter|exec|execute)\s/gi, '')
    .trim();
}

export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';
  return email.replace(/[^\w@.+\-]/g, '').trim();
}
