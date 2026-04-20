const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No Authorization header", isError: true });
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "null") {
      return res.status(401).json({ message: "Unauthorized token", isError: true });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: invalid signature", isError: true, err: err.message });
      }
      req.uid = result.id;
      next();
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error", isError: true, stack: error.stack });
  }
};

module.exports = { verifyToken };
