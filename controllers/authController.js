import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*-------------------------------------------------*/
import userSchema from "../models/User.js";

const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const foundUser = await userSchema.findOne({ email }).exec();
  if (foundUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userSchema.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  const accessToken = jwt.sign(
    { userInfo: { id: user._id } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userInfo: { id: user._id } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.json({
    accessToken,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const foundUser = await userSchema.findOne({ email }).exec();
  if (!foundUser)
    return res.status(400).json({ message: "User dose not exist" });

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) res.status(401).json({ message: "Wrong Password" });

  const accessToken = jwt.sign(
    { userInfo: { id: foundUser._id } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userInfo: { id: foundUser._id } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.json({
    accessToken,
    email: foundUser.email,
  });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await userSchema.findById(decoded.userInfo.id).exec();
      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        { userInfo: { id: foundUser._id } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({
        accessToken,
      });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.json({ message: "logout success" });
};

export { register, login, refresh, logout };
