const _ = require('lodash');

const parseErrors = (nodeRestfulErrors) => {
  const erros = [];

  _.forIn(nodeRestfulErrors, err => erros.push(err.message));

  return erros;
};

module.exports = (req, res, next) => {
  const { bundle } = res.locals;

  if (bundle.errors) {
    const errors = parseErrors(bundle.errors);

    res.status(500).send({ errors });
    return;
  }

  next();
};
