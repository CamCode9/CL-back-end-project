const { fetchApi } = require("../models/api.models");

exports.getApi = async (req, res, next) => {
  try {
    const result = await fetchApi();
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
