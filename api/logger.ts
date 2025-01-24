// put into a separate file instead of importing from app.ts in order to prevent the app.ts code from running upon import

import pino from 'pino';
export const logger = pino({
  transport: {
    target: 'pino-pretty', // pretty print
    options: {
      colorize: true
    },
  },
});