module.exports = (err, req, res, next) => {
  res.status(err.code || 500);
  res.send({ error: err });
};