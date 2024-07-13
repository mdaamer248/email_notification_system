const express = require("express");
const bodyParser = require("body-parser");
require("./database/db.connection");
const emailController = require("./email/email.controller");
const webhookController = require("./webhook/webhook.controller");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/emails", emailController);
app.use("/webhook", webhookController);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.listen(PORT, () => {
  console.log(`Server is up and running at port ${PORT}`);
});
