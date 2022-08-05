import { EventEmitter } from 'events';

interface AdditionalConcurencyCondition {
  concurency: number;
  condition(): boolean;
  block?: boolean; // Condition can only be met once
}

export class TasksExecutor {
  private tasksCompleted = 0;
  private readonly tasksLength;
  private concurrencyCurrent = 0;
  private concurrencyMax!: number;
  private myEmmiter = new EventEmitter();

  constructor(private tasks: string[], private conditions: AdditionalConcurencyCondition[]) {
    this.tasksLength = tasks.length;
  }

  public runAllTasks(concurrencyMax: number): Promise<void> {
    return new Promise(resolve => {
      this.concurrencyMax = concurrencyMax;
      const currentConcurency = Math.min(this.tasks.length - 1, concurrencyMax); // In case the number of tasks is less than the maximum number of threads.

      this.myEmmiter.on('finishTask', () => {
        this.tasksCompleted++;
        this.concurrencyCurrent--;
        if (this.tasksLength !== this.tasksCompleted) {
          this.conditions.forEach(i => {
            // If the condition is met, then take the value of concurrency from the object field.
            if (i.condition() && !i.block) {
              i.block = true; // Condition can only be met once
              this.concurrencyMax = i.concurency;
              const currentConcurency = Math.min(this.tasks.length - 1, i.concurency);
              console.log(`**** change concurence to ${currentConcurency}`);
              for (let j = 0; j <= currentConcurency; j++) {
                this.startNextTask();
              }
            }
          });
          this.startNextTask();
        } else {
          resolve();
        }
      });

      // Start the execution of tasks with a given number of сoncurency.
      for (let i = 0; i <= currentConcurency; i++) {
        this.startNextTask();
      }
    });
  }

  private async startNextTask(): Promise<void> {
    if (this.concurrencyCurrent > this.concurrencyMax) {
      return;
    }
    const currentTask: string | undefined = this.tasks.shift();
    if (!currentTask) {
      return;
    }
    console.log('[EXE] Concurency: ' + this.concurrencyCurrent++ + ' in ' + this.concurrencyMax);
    console.log('[EXE] TaskCount: ' + this.tasksCompleted + ' in ' + this.tasksLength);
    console.log('\x1b[31m', '[TASK] STARTING: ' + currentTask, '\x1b[0m');
    await this.doTask(currentTask);
    this.myEmmiter.emit('finishTask');
  }

  private doTask(taskName: string): Promise<boolean> {
    const begin = Date.now();
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        const end = Date.now();
        const timeSpent = end - begin + 'ms';
        console.log('\x1b[36m', '[TASK] FINISHED: ' + taskName + ' in ' + timeSpent, '\x1b[0m');
        resolve(true);
      }, Math.random() * 200);
    });
  }
}
