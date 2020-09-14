import { ScanPriorityMetadata } from '@augejs/provider-scanner';

export function ScanPriority(priority?: number): ClassDecorator {
  return function(target: Function) {
    ScanPriority.defineMetadata(target, priority);
  }
}

ScanPriority.defineMetadata = (target: object, priority?: number) => {
  ScanPriorityMetadata.defineMetadata(target, priority);
}

ScanPriority.getMetadata = (target: object): number => {
  return ScanPriorityMetadata.getMetadata(target);
}

