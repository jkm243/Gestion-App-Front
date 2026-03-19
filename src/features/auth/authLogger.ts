type AuthLogLevel = 'info' | 'warn' | 'error';

export function logAuthEvent(
  event: string,
  payload: Record<string, unknown> = {},
  level: AuthLogLevel = 'info'
) {
  const logger =
    level === 'warn'
      ? console.warn
      : level === 'error'
        ? console.error
        : console.info;

  logger(event, payload);
}
