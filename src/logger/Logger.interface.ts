export interface ILogger {
  error(message: any):void
  info(message: any):void
  warn(message: any):void;
  debug(message: any):void;
  verbose(message: any):void;
}

export interface ILogItem {
  context: string
  message: any
  level: string
}

export interface ILogTransport {
  printMessage(logItem:ILogItem):void;
}
