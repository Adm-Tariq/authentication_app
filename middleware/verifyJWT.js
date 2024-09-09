import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const cookies = req.cookies;

  if (!authHeader?.startsWith("Bearer ") || !cookies?.jwt)
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.userInfo.id;
    next();
  });
};

export default verifyJWT;
