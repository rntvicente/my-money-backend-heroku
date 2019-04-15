const express = require('express');

const billingCycleService = require('../api/billing-cycle/billing-cycle-service');
const authService = require('../api/user/auth-service');
const auth = require('./auth');

const routes = (server) => {
  const protectedApi = express.Router();
  server.use('/api', protectedApi);
  protectedApi.use(auth);

  billingCycleService.register(protectedApi, '/billingCycles');

  const openApi = express.Router();
  server.use('/oapi', openApi);

  openApi.post('/login', authService.login);
  openApi.post('/singup', authService.singup);
  openApi.post('/validateToken', authService.validateToken);
};

module.exports = routes;
