import pino from 'pino';
const logger = pino({
  prettyPrint: { colorize: true },
  redact:['password'],
  enabled: !process.env.TEST
});
export default logger;