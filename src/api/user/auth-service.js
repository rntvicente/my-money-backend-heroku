const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./user-schema');
const env = require('../../../.env');

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const sendErrorFromDB = (res, dbErros) => {
  const errors = [];

  _.forIn(dbErros.errors, error => errors.push(error.message));

  return res.status(400).json({ errors });
};

const login = (req, res) => {
  const { email: filter, password } = req.body;

  User.findOne({ filter }, (err, user) => {
    if (err) {
      sendErrorFromDB(res, err);
      return;
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const { name, email } = user;

      const token = jwt.sign({ ...user }, env.authSecret, {
        expiresIn: '1 day'
      });

      res.status(200).json({ name, email, token });
      return;
    }

    res.status(400).send({ errors: ['User/Password invalid'] });
  });
};

const validateToken = (req, res) => {
  const { token } = req.body;

  jwt.verify(token, env.authSecret, err => res.status(200).send({ valid: !err }));
};

const singup = (req, res, next) => {
  const {
    name,
    email,
    password,
    confirmPassword
  } = req.body;

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ['E-mail invalid.'] });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({ errors: ['Minimum 8 characters: Letters, numbers, and/or symbols'] });
  }

  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);

  if (!bcrypt.compareSync(confirmPassword, hash)) {
    return res.status(400).send({ errors: ['Passwords do not match'] });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorFromDB(res, err);
    }

    if (user) {
      return res.status(409).send({ errors: ['User exists.'] });
    }

    const newUser = new User({ name, email, password: hash });

    newUser.save((error) => {
      if (error) {
        return sendErrorFromDB(res, error);
      }

      if (user) {
        return res.status(400).send({ errors: ['User exists.'] });
      }

      return login(req, res, next);
    });

    return null;
  });

  return null;
};

module.exports = {
  login,
  validateToken,
  singup
};
