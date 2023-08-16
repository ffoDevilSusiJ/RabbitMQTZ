const express = require("express"); 
const app = express();

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = "debug";

const {TaskGenerator} = require('./rabbitmq');

const rabbit = new TaskGenerator("tasks", "results");
rabbit.init(); 

const port = 3001;
const pool = []; 

app.get("/calc", async (req, res) => {
  const task = {
    id: rabbit.generateId(),
    a: Number(req.query.a),
    b: Number(req.query.b),
  };
  rabbit.sendTask(task);
  pool.push({ task: task, connection: res });
  rabbit.waitForResult(pool);
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  logger.debug(`Server running on port: ${port}`); 
});


