import os from 'os';
import cluster, { Worker } from 'cluster';

import { IScanNode, Metadata } from '@augejs/provider-scanner';
import { ScanHook } from './ScanHook.decorator';

type ClusterOptions = {
  workers: number
  disabled?: boolean
};

export function Cluster (opts?:ClusterOptions):ClassDecorator {
  opts = {
    workers: 0,
    disabled: false,
    ...opts,
  };

  return function(target: Function) {
    Metadata.decorate([
      ScanHook(async (scanNode: IScanNode, next: Function) => {
        if (opts!.disabled) return;

        if (cluster.isMaster) {
          const cpuCount: number = os.cpus().length;
          let workers: number = opts?.workers || 0;
          if (workers < 0) {
            workers = Math.abs(Math.trunc(workers));
            workers = Math.min(workers, cpuCount);
          } else if (workers > 0) {
            workers = workers;
          } else {
            workers = cpuCount;
          }

          for(let i = 0; i < workers; i++) {
            cluster.fork();
          }

          cluster.on('exit', (worker: Worker, code: number, signal: string) => {
            if (code !== 0 && !worker.exitedAfterDisconnect) {
              cluster.fork();
            }
          })
          // end of master
        }

        if (cluster.worker) {

        }
      })
    ], target);
    Cluster.defineMetadata(target, opts!);
  }
}

Cluster.defineMetadata = (target: Object, opts: ClusterOptions)=> {
  Metadata.defineMergeObjectMetadata(Cluster, opts, target);
}

Cluster.hasMetadata = (target: Object): boolean => {
  return Metadata.hasMetadata(Cluster, target)
}

Cluster.getMetadata = (target: object):ClusterOptions => {
  return Metadata.getMetadata(Cluster, target) || {};
}
