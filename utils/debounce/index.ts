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
      this.timeout = setTimeout(() => {
        this.func?.(...args);
        this.isPending = false;
      }, this.wait);
    }
  }

  // Clear timeout if task needs to be canceled
  cancelTask() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.isPending = false;
      this.timeout = null;
    }
  }
}

// Debounce utility to prevent excessive function calls
export const debounce = (wait: number) => {
  return new TimedTask(wait);
};
