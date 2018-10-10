const validator = require('validator');
const sanitize = require('mongo-sanitize');

module.exports = (app) => {

  const Item = app.models.item;

  const ITEM_PROJECTION = 'foundDate foundBy foundPlace description found';
  const controller = {};

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

  controller.list = (req, res) => {
    Item.find({}, ITEM_PROJECTION)
      .sort({ foundDate: 1 })
      .lean(true)
      .exec()
      .then((items) => res.status(200).json(items))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Display detail page for a specific item on GET.
  controller.get = (req, res) => {
    const id = sanitize(req.params.id);
    Item.findOne({ id }, ITEM_PROJECTION)
      .lean(true)
      .exec()
      .then((item) => res.status(200).json(item))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Handle item create on POST.
  controller.add = (req, res) => {
    const {
      foundDate, foundBy, foundPlace, description, found
    } = req.body;
    // if (validateItem(false, { foundDate, foundBy, foundPlace, description, found })) {
    //   return res.status(505).json(new Error('Invalid item.'));
    // }
    const newItem = new Item({
      foundDate,
      foundBy,
      foundPlace,
      description,
      found
    });
    
    newItem
      .save()
      .then(async (item) => res.status(200).json(item))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
   };

  // Display item update form on PUT.
  controller.update = (req, res) => {
    const data = {};
    if (req.body.foundDate) data.foundDate = req.body.foundDate;
    if (req.body.foundBy) data.foundBy = req.body.foundBy;
    if (req.body.foundPlace) data.foundPlace = req.body.foundPlace;
    if (req.body.description) data.description = req.body.description;
    if (req.body.found) data.found = req.body.found;

    const _id = sanitize(req.params.id);

    Item.findOneAndUpdate({ _id }, data, { new: true })
      .lean(true)
      .exec()
      .then(async (car) => res.status(200).json(car))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Handle item delete on DELETE.
  controller.delete = (req, res) => {
    const _id = sanitize(req.params.id);
    Item.findOneAndDelete({ _id })
      .exec()
      .then(() => res.status(200).end())
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Handle commentary create on POST.
  controller.addCommentary = (req, res) => {
    const _id = sanitize(req.params.id);
    Item.findById({ _id })
    .then((item) => item.comment({
      author: req.body.author_id,
      text: req.body.comment
    }))
    .then(() => res.status(200).json(car))
    .catch((error) => {
      console.log('Error:', error);
      return res.status(500).json(error);
    });
  };

  // // Display all commentaries for a specific item on GET.
  // controller.getCommentary = (req, res) => { };

  // // Display commmentary update form on PUT.
  // controller.updateCommentary = (req, res) => { };

  // // Handle commentary delete on DELETE.
  // controller.deleteCommentary = (req, res) => { };

  return controller;

};