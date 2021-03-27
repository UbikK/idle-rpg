import pino from 'pino';
const logger = pino({
  prettyPrint: true,
  redact:['password']
});
export default logger;