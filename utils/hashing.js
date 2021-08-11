const bcrypt = require("bcrypt");

const saltRounds = 10;
const hashPassword = async (plainTextPass) => {
  if (!plainTextPass) return;
  const hash = await bcrypt.hash(plainTextPass, saltRounds);
  return hash;
};

const hashCompare = async (pass, hashedPass) => {
  return await bcrypt.compare(pass, hashedPass);
};

module.exports.hashPassword = hashPassword;
module.exports.hashCompare = hashCompare;
