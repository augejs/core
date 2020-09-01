import { ILogItem, ILogTransport } from "./Logger.interface";

export class ConsoleLogTransport implements ILogTransport {
  printMessage(logItem:ILogItem) {
    console.log(`[${logItem.level}] - ${logItem.context} ${logItem.message}`);
  }
}
