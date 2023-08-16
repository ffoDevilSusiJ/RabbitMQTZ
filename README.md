# RabbitMQTZ

This project is a tool for generating and handling tasks using RabbitMQ message broker.

## Requirements
* Node.js
* RabbitMQ 
* Erlang 

## Installation

1. Clone the repository: `git clone https://github.com/user/repo.git`
2. Install dependencies: `npm install`

## Usage

1. Start the RabbitMQ server.
2. Start the services: `npm run dev`
3. Send a task to the service using the `/calc?a={value}&b={value}` endpoint.

## Endpoints
* `/calc`: Sends the task and returns the result.
```json
{
    "a": number,
    "b": number,
    "id": string,
    "result": number
}
```

## Configuration
The service can be configured using the following environment variables:

* `RABBITMQ_HOST`: The hostname of the RabbitMQ server. Default is `localhost`.
* `RABBITMQ_PORT`: The port number of the RabbitMQ server. Default is `5672`.
* `RABBITMQ_USER`: The username for authenticating with the RabbitMQ server. Default is `guest`.
* `RABBITMQ_PASS`: The password for authenticating with the RabbitMQ server. Default is `guest`.

You can modify the configuration settings in `config/default.json`, such as the server.port. Default is 3001.

## License
This project is licensed under the MIT License - see the LICENSE file for details.