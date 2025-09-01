
const WEBAPP_MONITOR_URL = process.env.NEXT_PUBLIC_WEBAPP_MONITOR_URL;
const API_KEY = process.env.NEXT_PUBLIC_WEBAPP_MONITOR_API_KEY;

if (!WEBAPP_MONITOR_URL || !API_KEY) {
  console.warn('Webapp monitor URL or API key not provided. Logs will not be sent.');
}

type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
}

async function sendLog(payload: LogPayload) {
  if (!WEBAPP_MONITOR_URL || !API_KEY) {
    return;
  }

  try {
    await fetch(`${WEBAPP_MONITOR_URL}/api/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to send log to webapp-monitor:', error);
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    sendLog({ level: 'info', message, meta });
    console.log(message, meta);
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    sendLog({ level: 'warn', message, meta });
    console.warn(message, meta);
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    sendLog({ level: 'error', message, meta });
    console.error(message, meta);
  },
};
