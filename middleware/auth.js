const jwt = require("jsonwebtoken");

const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    return decoded;
  } catch (err) {
    console.log("error:", err.message);
  }
};

const verifyUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "'token' is missing from headers" });
  const payload = await verifyToken(token);
  if (!payload)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user" });
  req.headers.payload = payload;
  next();
};

module.exports.verifyUser = verifyUser;
