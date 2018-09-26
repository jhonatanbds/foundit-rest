module.exports = (app) => {
  const controller = app.auth.controller;
  const permission = app.utils.permission;

  app.route('/login').post(controller.login);
  app.route('/logout').post(permission.isLoggedIn, controller.logout);
};
