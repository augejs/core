import os from 'os';
import cluster, { Worker } from 'cluster';
import { IScanNode, Metadata } from '@augejs/provider-scanner';
import { LifecycleOnAppWillCloseHook, Lifecycle__onAppReady__Hook } from './LifecycleHook.decorator';
import { Logger } from '../logger';
import { Module } from './Module.decorator';

const logger = Logger.getLogger('cluster');

type ClusterOptions = {
  workers: number
  enable?: boolean
  clusterModule?: Function
};

@Module()
export class DefaultClusterModule {}

export function Cluster(opts?:ClusterOptions): ClassDecorator {
  opts = {
    workers: 0,
    enable: true,
    ...opts,
  };

  return function(target: Function) {
    Cluster.defineMetadata(target, opts!);
  }
}

Cluster.hasMetadata = (target: Object): boolean => {
  return Metadata.hasMetadata(Cluster, target)
}

Cluster.defineMetadata = (target: Object, opts: ClusterOptions)=> {
  Metadata.defineMetadata(Cluster, opts, target);
}

Cluster.getMetadata = (target: object):ClusterOptions => {
  return Metadata.getMetadata(Cluster, target) || {
    workers: 0
  };
}

Cluster.DefaultClusterModule = DefaultClusterModule;

Cluster.ClusterMasterClassDecorator = function (opts?:ClusterOptions):ClassDecorator {
  opts = {
    workers: 0,
    ...opts,
  };

  return function(target: Function) {
    Metadata.decorate([
      Lifecycle__onAppReady__Hook(async (scanNode: IScanNode, next: Function) => {
        const cpuCount: number = os.cpus().length;
        let workers: number = opts?.workers || parseInt(process.env.WORKERS || '0') || 0;
        if (workers < 0) {
          workers = Math.abs(Math.trunc(workers));
          workers = Math.min(workers, cpuCount);
        } else if (workers > 0) {
          workers = workers;
        } else {
          workers = cpuCount;
        }

        await Promise.all(
          Array.from(new Array(workers)).map(()=>{
            return new Promise((resolve: Function, reject: Function) => {
              const worker = cluster.fork()
              .once('exit', (code: number, signal: string) => {
                reject(new Error(`worker(pid: ${worker.process.pid}) Boot Error`));
              })
              .once('message', (message: any)=> {
                if (message?.cmd === '__onAppReady__') {
                  worker.removeAllListeners('exit');
                  resolve();
                }
              })
            })
          })
        )

        cluster.on('exit', (worker: Worker, code: number, signal: string) => {
          if (!worker.exitedAfterDisconnect) {
            logger.info(`worker(pid: [${worker.process.pid}]) is exit. code: ${code} signal: ${signal} and will be forked new process`);
            cluster.fork();
          }
        });
        await next();
      }),

      LifecycleOnAppWillCloseHook(async (scanNode: IScanNode, next: Function) => {
        cluster.removeAllListeners('exit');
        await Promise.all(Object.values(cluster.workers).map((worker?: Worker) => {
          return new Promise((resolve: Function) => {
            if (!worker) {
              resolve();
              return;
            }
            worker.once('exit', ()=>{
              logger.warn(`worker(pid: [${worker.process.pid}]) is exited with signal: SIGTERM`);
              resolve();
            });

            worker.process.kill('SIGTERM');
            logger.info(`worker(pid: [${worker.process.pid}]) is killed with signal: SIGTERM`);
          })
        }))

        await next();
      })
    ], target);
  }
}
