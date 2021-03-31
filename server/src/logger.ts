import pino from 'pino';
const logger = pino({
  prettyPrint: { colorize: true },
  redact:['password']
});
export default logger;