export class TimedTask {
    timeout: NodeJS.Timeout | null = null;
    isPending: boolean = false;
    wait: number;
    func: Function | null = null;
    constructor(waitArg: number) {
      this.wait = waitArg;
    }
    doTask(funcArg: Function, ...args: any[]) {
      this.func = funcArg;
      if (!this.isPending) {
        this.isPending = true;
        setTimeout(() => {
          this.func?.(...args);
          this.isPending = false;
        }, this.wait);
      }
    }
  }
  export const debounce = (wait: number) => {
    return new TimedTask(wait);
  };
  