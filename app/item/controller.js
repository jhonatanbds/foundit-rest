module.exports = (app) => {

  const service = app.item.service;
  const controller = {};

  controller.list = (req, res) => {
    service.getAllItems()
      .then((items) => res.status(200).json(items))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Display detail page for a specific item on GET.
  controller.get = (req, res) => {
    const id = sanitize(req.params.id);
    service.getItem(id)
      .then((item) => res.status(200).json(item))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Handle item create on POST.
  controller.add = (req, res) => {
    const foundBy = req.user._id;
    const {
      foundDate, foundPlace, description, found
    } = req.body;
    if (!service.validateItem(false, { foundDate, foundBy, foundPlace, description, found })) {
      return res.status(500).json(new Error('Invalid item.'));
    }
    service.addItem(owner, { foundDate, foundBy, foundPlace, description, found })
      .then((item) => res.status(200).json(item))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
   };

  // Display item update form on PUT.
  controller.update = (req, res) => { };

  // Handle item delete on DELETE.
  controller.delete = (req, res) => { };

  controller.listCommentary = (req, res) => {
    res.status(200).json([{
      text: "muito bonito esse item rs!"
    }, {
      text: "comprei um igual ontem"
    }]);
  };

  // Display all commentaries for a specific item on GET.
  controller.getCommentary = (req, res) => { };

  // Handle commentary create on POST.
  controller.addCommentary = (req, res) => { };

  // Display commmentary update form on PUT.
  controller.updateCommentary = (req, res) => { };

  // Handle commentary delete on DELETE.
  controller.deleteCommentary = (req, res) => { };

  return controller;

};