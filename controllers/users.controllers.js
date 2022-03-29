const { selectAllUsers } = require("../models/users.models");

exports.getUsers = async (req, res, next) => {
  try {
    const result = await selectAllUsers();
    res.status(200).send({ users: result });
  } catch (err) {
    console.log("SOMETHINGS FUCKED");
    next(err);
  }
};
