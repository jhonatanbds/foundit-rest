module.exports = (app) => {
  const controller = app.controllers.user;
  const permission = app.utils.permission;

  app
    .route('/user')
    .post(controller.add)
    .get(controller.list)
    .put(permission.isLoggedIn, controller.update)
    .delete(permission.isLoggedIn, controller.delete);

  app
    .route('/user/:id')
    .get(controller.get);    

  app
    .route('/user/:id/item')
    .get(controller.listItem);

};
