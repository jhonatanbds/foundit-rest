module.exports = (app) => {
  const controller = app.controllers.user;

  app
    .route('/user')
    .post(controller.add)
    .get(controller.list);

  app
    .route('/user/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete);

  app
    .route('/user/:id/item')
    .get(controller.listItem);

};
