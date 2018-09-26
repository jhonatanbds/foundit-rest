module.exports = (app) => {

  const Item = app.item.model;

  const ITEM_PROJECTION = 'foundDate foundBy foundPlace description found';

  const getItem = (id, owner) => {
    return Item.findOne({ id, owner }, ITEM_PROJECTION)
      .lean(true)
      .exec();
  }
}

