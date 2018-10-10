module.exports = (app) => {

  const controller = app.controllers.item;
  const permission = app.utils.permission;

  app
    .route('/item')
    .post(permission.isLoggedIn, controller.add)
    .get(controller.list);

  app
    .route('/item/:id')
    .get(controller.get)
    .put(permission.isLoggedIn, controller.update)
    .delete(permission.isLoggedIn, controller.delete);

  app
    .route('/item/:id/commentary')
    .post(permission.isLoggedIn, controller.addCommentary);

};
