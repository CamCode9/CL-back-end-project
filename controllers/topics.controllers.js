const { selectAllTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  selectAllTopics().then((result) => {
    res.status(200).send({ topics: result });
  });
};
