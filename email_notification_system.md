# Email Notification System Documentation

## Objective

Design and develop an email notification system using Node.js, MongoDB, Mailgun, and RabbitMQ for queue management.

## Technologies Used

- **Backend**: Node.js
- **Database**: MongoDB
- **Email Service Provider**: Mailgun
- **Queue System**: RabbitMQ

## Requirements

1. **Email Composition**

   - Allow users to compose and send emails.

2. **Webhook Integration**

   - Integrate with Mailgun via webhooks to receive email status updates.

3. **Real-Time Notifications (Optional)**

   - Use socket connections (Socket.io) to deliver instant updates on email status changes.

4. **Asynchronous Processing**

   - Implement a queue system (RabbitMQ) to handle email sending asynchronously.

5. **API Development**

   - Create APIs for email composition, sending, and status updates with Node.js.

6. **Database Storage**
   - Store email and user data in MongoDB.

## Steps Taken

1. **Project Setup**

   - Initialized a Node.js project with Express framework.
   - Integrated MongoDB (Mongoose) for data persistence.

2. **Email Composition API**

   - Developed an endpoint (`POST /api/emails/send`) to allow users to compose and send emails.
   - Validated request data and handled errors gracefully.

3. **Mailgun Integration**

   - Configured Mailgun API key and domain for sending emails.
   - Implemented webhook handler (`POST /api/webhook`) to receive and process email status updates from Mailgun.

4. **Queue System (RabbitMQ)**

   - Implemented a RabbitMQ queue for asynchronous email sending.
   - Created producers to add email tasks to the queue (`sendToEmailQueue` function).
   - Developed consumers to process email tasks from the queue (`consumeEmailQueue` function).

5. **Database Schema and Models**

   - Designed MongoDB schemas (`Email` model) to store email data including status, timestamps, and response details.

6. **Error Handling and Logging**
   - Implemented error handling middleware to catch and log errors.
