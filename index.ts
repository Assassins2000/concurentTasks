import { TasksExecutor } from './TaskExecutor';

async function init(): Promise<void> {
    const numberOfTasks = 20;
    const concurrencyMax = 4;
    const taskList = [...Array(numberOfTasks)].map(() =>
      [...Array(~~(Math.random() * 10 + 3))].map(() => String.fromCharCode(Math.random() * (123 - 97) + 97)).join(''),
    );
    console.log('[init] Concurrency Algo Testing...');
    console.log('[init] Tasks to process: ', taskList.length);
    console.log('[init] Task list: ' + taskList);
    console.log('[init] Maximum Concurrency: ', concurrencyMax, '\n');
    const taskExecutor = new TasksExecutor(taskList, [
      {
        concurency: 8,
        condition(): boolean {
          return true;
        },
      },
    ]);
    await taskExecutor.runAllTasks(4);
    console.log('All tasks successfully completed');
  }
  
  init().then();