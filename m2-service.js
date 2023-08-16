const {TaskHandler} = require('./rabbitmq'); 

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = "debug";

const run = async () => {
  const taskHandler = new TaskHandler('tasks', 'results');
  await taskHandler.init();
  logger.debug("Start listening");
  await taskHandler.startHandlingTasks();
}

run().catch(console.error);


