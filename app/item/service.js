module.exports = (app) => {

  const Item = app.item.model;

  const ITEM_PROJECTION = 'foundDate foundBy foundPlace description found';

  const validateItem = (updating, {
    foundDate, foundBy, foundPlace, description, found
  }) => {
    let isValid = true;
    isValid =
      foundPlace && isValid ? !validator.isEmpty(foundPlace.trim()) : isValid && updating;
    isValid =
      description && isValid ? !validator.isEmpty(description.trim()) : isValid && updating;
    return isValid;
  };

  const getItem = (id) => {
    return Item.findOne({ id }, ITEM_PROJECTION)
      .lean(true)
      .exec();
  }

  const getAllItems = () => {
    Item.find({}, ITEM_PROJECTION)
      .sort({ foundDate: 1 })
      .lean(true)
      .exec();
  }

  const addItem = (owner, { foundDate, foundBy, foundPlace, description, found }) => {
    
    const newItem = new Item({
      foundDate,
      foundBy,
      foundPlace,
      description,
      found
    });

    newItem
      .save()
  }
}

