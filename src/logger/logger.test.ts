import { Logger } from './Logger';
import { LogTransport } from './Logger.interface';
import { LogLevel } from './LogLevel';

describe('logger', () => {
  beforeEach(() => {
    Logger.clear();
    Logger.removeAllTransports();
  });

  it('get logger cache the context result', () => {
    expect(Logger.getLogger('a')).toEqual(Logger.getLogger('a'));
    expect(Logger.getLogger('a')).not.toEqual(Logger.getLogger('b'));
  });

  it('add remove Transport', () => {
    const fn = jest.fn();
    const mockLogTransport: LogTransport = {
      printMessage() {
        fn();
      },
    };

    Logger.addTransport(mockLogTransport);

    Logger.getLogger('a').info('1');

    expect(fn).toHaveBeenCalledTimes(1);

    Logger.removeTransport(mockLogTransport);

    Logger.getLogger('a').info('2');

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should execute too many times after add Transport', () => {
    const fn = jest.fn();
    const mockLogTransport: LogTransport = {
      printMessage() {
        fn();
      },
    };

    Logger.getLogger('e').info('e-1');
    Logger.getLogger('e').info('e-2');
    Logger.getLogger('e').info('e-3');

    expect(fn).toHaveBeenCalledTimes(0);
    Logger.addTransport(mockLogTransport);
    expect(fn).toHaveBeenCalledTimes(3);

    Logger.removeTransport(mockLogTransport);
  });

  it('log level', () => {
    const fn = jest.fn();
    const mockLogTransport: LogTransport = {
      printMessage() {
        fn();
      },
    };

    Logger.addTransport(mockLogTransport);

    Logger.logLevel = LogLevel.VERBOSE;
    Logger.getLogger('c').verbose('1');
    Logger.getLogger('c').debug('1');
    Logger.getLogger('c').info('1');
    Logger.getLogger('c').warn('1');
    Logger.getLogger('c').error('1');
    expect(fn).toHaveBeenCalledTimes(5);

    Logger.logLevel = LogLevel.DEBUG;
    Logger.getLogger('c').verbose('1');
    Logger.getLogger('c').debug('1');
    Logger.getLogger('c').info('1');
    Logger.getLogger('c').warn('1');
    Logger.getLogger('c').error('1');
    expect(fn).toHaveBeenCalledTimes(9); // 5+4

    Logger.logLevel = LogLevel.INFO;
    Logger.getLogger('c').verbose('1');
    Logger.getLogger('c').debug('1');
    Logger.getLogger('c').info('1');
    Logger.getLogger('c').warn('1');
    Logger.getLogger('c').error('1');
    expect(fn).toHaveBeenCalledTimes(12); // 9+3

    Logger.logLevel = LogLevel.WARN;
    Logger.getLogger('c').verbose('1');
    Logger.getLogger('c').debug('1');
    Logger.getLogger('c').info('1');
    Logger.getLogger('c').warn('1');
    Logger.getLogger('c').error('1');
    expect(fn).toHaveBeenCalledTimes(14); // 12+2

    Logger.logLevel = LogLevel.ERROR;
    Logger.getLogger('c').verbose('1');
    Logger.getLogger('c').debug('1');
    Logger.getLogger('c').info('1');
    Logger.getLogger('c').warn('1');
    Logger.getLogger('c').error('1');
    expect(fn).toHaveBeenCalledTimes(15); // 14+1

    Logger.logLevel = LogLevel.VERBOSE;
    Logger.enable = false;
    Logger.getLogger('c').verbose('1');
    Logger.getLogger('c').debug('1');
    Logger.getLogger('c').info('1');
    Logger.getLogger('c').warn('1');
    Logger.getLogger('c').error('1');
    expect(fn).toHaveBeenCalledTimes(15); // 15 + 5

    Logger.removeTransport(mockLogTransport);
  });
});
