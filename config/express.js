const express = require('express');
const load = require('express-load');
const bodyParser = require('body-parser');
const helmet = require('helmet');

module.exports = () => {
  const app = express();

  app.set('port', process.env.PORT || 3000);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(helmet());

  load('utils', { cwd: 'app' })
    .then('item')
    .then('user')
    .then('auth')
    .into(app);

  return app;
};
