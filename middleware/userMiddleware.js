const User = require("../models/user");
const { Types } = require("mongoose");

async function getUser(req, res, next) {
  try {
    const id = req.params.id;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(req.params.id);

    if (user == null) {
      return res.status(404).json({ message: "Can't find user" });
    }

    res.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { getUser };