import { ILogItem, ILogTransport } from "./Logger.interface";
import { LogLevel } from "./LogLevel";

export class ConsoleLogTransport implements ILogTransport {
  printMessage(logItem:ILogItem):void {
    const methodNameMap = {
      [LogLevel.VERBOSE]: 'debug',
      [LogLevel.DEBUG]: 'debug',
      [LogLevel.INFO]: 'info',
      [LogLevel.WARN]: 'warn',
      [LogLevel.ERROR]: 'error',
    };

    const methodName:string = methodNameMap[logItem.level];
    if (!methodName) return;

    const message = `${new Date(logItem.timestamp).toISOString()} [${process.pid}] [${logItem.context || '-'}] [${logItem.level}] - ${logItem.message}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (console as any)[methodName](message);
  }
}
