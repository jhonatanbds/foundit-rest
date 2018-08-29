module.exports = (app) => {
  const controller = app.controllers.item;

  app
    .route('/item')
    .post(controller.add)
    .get(controller.list);

  app
    .route('/item/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete);
};
