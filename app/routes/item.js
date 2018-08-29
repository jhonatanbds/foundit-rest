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

  app
    .route('/item/:id/commentary')
    .post(controller.addCommentary)
    .get(controller.listCommentary);

  app
    .route('/item/:id/commentary/:id')
    .get(controller.getCommentary)
    .put(controller.updateCommentary)
    .delete(controller.deleteCommentary);

};
