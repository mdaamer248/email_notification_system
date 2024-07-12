const amqp = require("amqplib/callback_api");

const RABBITMQ_URL = "amqp://localhost";
const EMAIL_QUEUE_NAME = "emailQueue";
const STATUS_UPDATE_QUEUE = "statusUpdateQueue";

// Function to connect to RabbitMQ and return the channel
const connectRabbitMQ = (callback) => {
  amqp.connect(RABBITMQ_URL, (err, connection) => {
    if (err) {
      throw err;
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }
      channel.assertQueue(EMAIL_QUEUE_NAME, { durable: true });
      channel.assertQueue(STATUS_UPDATE_QUEUE, { durable: true });
      callback(channel);
    });
  });
};

// Function to send a message to the queue
const sendToEmailQueue = (message) => {
  connectRabbitMQ((channel) => {
    channel.sendToQueue(
      EMAIL_QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      }
    );
  });
};

// Function to consume messages from the queue
const consumeEmailQueue = (callback) => {
  connectRabbitMQ((channel) => {
    channel.consume(EMAIL_QUEUE_NAME, (msg) => {
      if (msg !== null) {
        callback(JSON.parse(msg.content.toString()), () => {
          channel.ack(msg);
        });
      }
    });
  });
};

// Function to send a message to the status update queue
const sendToStatusUpdateQueue = (message) => {
  connectRabbitMQ((channel) => {
    channel.sendToQueue(
      STATUS_UPDATE_QUEUE,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      }
    );
  });
};

// Function to consume messages from the status update queue
const consumeStatusUpdateQueue = (callback) => {
  connectRabbitMQ((channel) => {
    channel.consume(STATUS_UPDATE_QUEUE, (msg) => {
      if (msg !== null) {
        callback(JSON.parse(msg.content.toString()), () => {
          channel.ack(msg);
        });
      }
    });
  });
};

module.exports = {
  sendToEmailQueue,
  consumeEmailQueue,
  sendToStatusUpdateQueue,
  consumeStatusUpdateQueue,
};
