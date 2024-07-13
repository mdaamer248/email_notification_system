const express = require("express");
const bodyParser = require("body-parser");
require("./database/db.connection");
const emailController = require("./email/email.controller");
const webhookController = require("./webhook/webhook.controller");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/emails", emailController);
app.post("/api/webhook", webhookController);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
