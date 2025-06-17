import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'ai-chatbot',
    // Optional: Add more config if needed
    // debug: true,
    // exportIntervalMillis: 1000,
  });
}
