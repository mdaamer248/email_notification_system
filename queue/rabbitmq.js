const amqp = require("amqplib/callback_api");

const RABBITMQ_URL = "amqp://localhost";
const EMAIL_QUEUE_NAME = "emailQueue";
const STATUS_UPDATE_QUEUE = "statusUpdateQueue";
const RETRY_QUEUE = "retryEmailQueue";
const MAX_RETRIES = 3;

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
      channel.assertQueue(RETRY_QUEUE, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": "",
          "x-dead-letter-routing-key": "emailQueue",
        },
      });

      callback(channel);
    });
  });
};

// Function to send a message to the email queue
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

// Function to consume messages from the email queue with retry mechanism
const consumeEmailQueue = (callback) => {
  connectRabbitMQ((channel) => {
    channel.consume(EMAIL_QUEUE_NAME, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        const retryCount = msg.properties.headers["x-retry-count"] || 0;

        callback(content, (err) => {
          if (err && retryCount < MAX_RETRIES) {
            // If there's an error and we haven't exceeded max retries
            const newRetryCount = retryCount + 1;
            const delay = 1000 * 2 ** newRetryCount;

            channel.sendToQueue(RETRY_QUEUE, msg.content, {
              persistent: true,
              headers: { "x-retry-count": newRetryCount },
              expiration: delay.toString(),
            });
            channel.ack(msg);
          } else if (err) {
            console.error(
              `Max retries reached for message: ${JSON.stringify(content)}`
            );

            channel.ack(msg);
          } else {
            channel.ack(msg);
          }
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
