import userSchema from "../models/User.js";

const getAllUsers = async (req, res) => {
  const users = await userSchema.find().select("-password").lean();
  if (!users.length) return res.status(400).json({ message: "No users found" });
  res.json(users);
};

export default getAllUsers;
