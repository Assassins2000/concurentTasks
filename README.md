Node.js test task

Using the class "TaskExecutor", you can simultaneously execute any number of promises with a given number of threads.
The class has only one public method runAllTasks(concurrencyMax), where concurrencyMax - the maximum number of level concurrency.
The concurrency level can be changeable on the fly. To do this, you need to pass an array of objects that implement the AdditionalConcurencyCondition interface to the class constructor.

To correctly complete tasks, an EventEmitter is used. The "task finished" event handler is implemented. With the help of this handler, we can correctly track the moment of completion of all tasks and resolve the promise.