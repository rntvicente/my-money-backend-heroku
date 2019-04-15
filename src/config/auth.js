const jwt = require('jsonwebtoken');

const env = require('../../.env');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  const token = req.body.token || req.query.token || req.headers['authorization'];

  if (!token) {
    return res.status(403).send({
      errors: ['No token provided']
    });
  }

  jwt.verify(token, env.authSecret, (err) => {
    if (err) {
      return res.status(403).send({ errors: ['Failed to autheticate token.'] })
    }

    next();
  });
};