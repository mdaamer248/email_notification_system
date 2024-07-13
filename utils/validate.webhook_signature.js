const crypto = require("crypto");

const verify = (signingKey, timestamp, token, signature) => {
  const encodedToken = crypto
    .createHmac("sha256", signingKey)
    .update(timestamp.concat(token))
    .digest("hex");

  console.log({ isValid: encodedToken === signature });

  return encodedToken === signature;
};

module.exports = { verify };
