/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILogger {
  error(message: any): void;
  info(message: any): void;
  warn(message: any): void;
  debug(message: any): void;
  verbose(message: any): void;
}

export interface LogItem {
  context: string;
  message: any;
  level: string;
  timestamp: number;
  [key: string]: any;
}

export interface LogTransport {
  printMessage(logItem: LogItem): void;
}
