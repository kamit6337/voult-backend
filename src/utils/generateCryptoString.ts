import crypto from "node:crypto";

const generateCryptoString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

export default generateCryptoString;
