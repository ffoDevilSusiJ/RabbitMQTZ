const amqp = require("amqplib");

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = "debug";


class TaskHandler {
  constructor(queueName, resultQueueName) {
    this.queueName = queueName;
    this.resultQueueName = resultQueueName;
  }

  async init() {
    this.connection = await amqp.connect('amqp://127.0.0.1');
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(this.queueName, {autoDelete: true});
    await this.channel.assertQueue(this.resultQueueName, {autoDelete: true});
    logger.debug("Connected to RabbitMQ");
  }

  async handleTask(task) {
    
    const result = task.a + task.b;
    return { id: task.id, result: result };
  }

  async startHandlingTasks() {
    
    this.channel.consume(this.queueName, async message => {
      const task = JSON.parse(message.content.toString()); 
      logger.debug(`Received task: ${JSON.stringify(task)}`);
      
      const result = await this.handleTask(task);

      this.channel.sendToQueue(this.resultQueueName, Buffer.from(JSON.stringify(result)));

      logger.debug(`Sent result back: ${JSON.stringify(result)}`);
      
      this.channel.ack(message);
    });
  }
}

class TaskGenerator {
  constructor(queueName, resultQueueName) {
    this.queueName = queueName;
    this.resultQueueName = resultQueueName;
  }

  async init() {
    this.connection = await amqp.connect('amqp://127.0.0.1');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, {autoDelete: true});
    await this.channel.assertQueue(this.resultQueueName, {autoDelete: true});
    logger.debug("Connected to RabbitMQ");
  }

  async sendTask(task) { 
    this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(task)));
    logger.debug(`Sent task to queue: ${JSON.stringify(task)}`); 
  }

  async waitForResult(pool) {
    const resultMessage = await this.channel.consume(
      this.resultQueueName,
      (message) => {
        if (message) {
          const result = JSON.parse(message.content.toString());
          pool.forEach(({ task, connection }) => {
            if (task.id == result.id) {
              logger.debug(`Task ${JSON.stringify(result)} completed`); 
              connection.status(200).send({a: task.a, b: task.b, ...result}); 
              this.channel.ack(message); 
              return result;
            }
          });
        }
      }
    ); 
  }
  
  generateId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${random}`;
  }
}

module.exports = { TaskGenerator, TaskHandler };