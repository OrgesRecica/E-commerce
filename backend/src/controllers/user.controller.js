import User from '../models/User.js';

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { name, address } = req.body;
    const update = {};
    if (name) update.name = name;
    if (address) update.address = address;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
}
