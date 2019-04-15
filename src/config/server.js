const express = require('express');
const parser = require('body-parser');
const queryParse = require('express-query-int');
const debug = require('debug')('server');
const chalk = require('chalk');
const morgan = require('morgan');

const allowsCors = require('./cors');

const server = express();
const port = process.env.PORT || 3000;

server.use(morgan('tiny'));
server.use(parser.urlencoded({ extended: true }));
server.use(queryParse());
server.use(parser.json());
server.use(allowsCors);

server.listen(port, () => {
  debug(`Listing on port ${chalk.green(port)}.`);
});

module.exports = server;
