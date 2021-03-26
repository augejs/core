/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ILogTransport, ILogItem, ILogger } from './Logger.interface';
import { LogLevel } from './LogLevel';

const logTransports: ILogTransport[] = [];
const queueLogItems: ILogItem[] = [];
const LogLevelPriority = {
  [LogLevel.VERBOSE]: 0,
  [LogLevel.DEBUG]: 2,
  [LogLevel.INFO]: 4,
  [LogLevel.WARN]: 8,
  [LogLevel.ERROR]: 16,
}
const contextLoggerMap:Map<string, ILogger> = new Map();

// utils
function isLogLevelEnabled(currentLevel: string, allowLevel: string): boolean {
  const currentLevelPriority:number = LogLevelPriority[currentLevel] || LogLevelPriority[LogLevel.VERBOSE];
  const allowLevelLevelPriority:number = LogLevelPriority[allowLevel] || LogLevelPriority[LogLevel.VERBOSE];
  return currentLevelPriority >= allowLevelLevelPriority;
}

function processQueueLogItems(logItem?:ILogItem) {
  if (!Logger.enable) return;

  if (logItem) {
    if (!isLogLevelEnabled(logItem.level, Logger.logLevel)) return;
    queueLogItems.push(logItem);
  }

  if (logTransports.length === 0) return;

  while(queueLogItems.length) {
    const nextLogItem:ILogItem | undefined = queueLogItems.shift();
    if (nextLogItem) {
      for (const transport of logTransports) {
        transport.printMessage(nextLogItem);
      }
    }
  }
}

export class Logger implements ILogger {

  public static enable = true;
  public static logLevel: string = LogLevel.VERBOSE;

  public static getLogger(context = ''):ILogger {
    let logger:ILogger | undefined = contextLoggerMap.get(context);
    if (!logger) {
      logger = new Logger(context);
      contextLoggerMap.set(context, logger);
    }
    return (logger as ILogger);
  }

  public static addTransport(transport: ILogTransport):void {
    if (logTransports.includes(transport)) return;
    logTransports.push(transport);

    processQueueLogItems();
  }

  public static removeTransport(transport: ILogTransport):void {
    const findIdx = logTransports.indexOf(transport);
    if (findIdx === -1) return;
    logTransports.splice(findIdx, 1);
  }

  public static removeAllTransports():void {
    logTransports.length = 0;
  }

  public static getTransportCount(): number {
    return logTransports.length;
  }

  public static clear():void {
    queueLogItems.length = 0;
  }

  private constructor (private readonly context: string = '') {}

  error(message: any):void {
    processQueueLogItems({
      context: this.context,
      message,
      level: LogLevel.ERROR,
      timestamp: Date.now(),
    });
  }

  verbose(message: any):void {
    processQueueLogItems({
      context: this.context,
      message,
      level: LogLevel.VERBOSE,
      timestamp: Date.now(),
    });
  }

  debug(message: any):void {
    processQueueLogItems({
      context: this.context,
      message,
      level: LogLevel.DEBUG,
      timestamp: Date.now(),
    });
  }

  info(message: any):void {
    processQueueLogItems({
      context: this.context,
      message,
      level: LogLevel.INFO,
      timestamp: Date.now(),
    });
  }

  warn(message: any):void {
    processQueueLogItems({
      context: this.context,
      message,
      level: LogLevel.WARN,
      timestamp: Date.now(),
    });
  }
}
