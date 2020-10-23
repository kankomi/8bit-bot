import { createLogger, format, transports } from 'winston'

const { timestamp: fTimestamp, combine, splat, colorize } = format

const myFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `
  if (metadata && Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata)
  }
  return msg
})

const level = process.env.NODE_ENV === 'development' ? 'debug' : 'info'
const logger = createLogger({
  exitOnError: false,
  level,
  transports: [new transports.Console({ level })],
  format: combine(colorize(), splat(), fTimestamp(), myFormat),
})

export default logger
