module.exports = (app) => {
  const Item = app.models.item;

  const controller = {}

  const ITEM_PROJECTION = 'owner brand model year plate odometer';


  controller.list = (req, res) => {
    res.status(200).json([{
      nome: "casaco",
      data: "ontem"
    }, {
      nome: "relogio",
      data: "hoje"
    }]);
  };

  // Display detail page for a specific item on GET.
  controller.get = (req, res) => {
    const _id = sanitize(req.params.id);
    const owner = req.user._id;
    Item.findOne({ _id, owner }, ITEM_PROJECTION)
      .lean(true)
      .exec()
      .then((item) => res.status(200).json(item))
      .catch((error) => {
        console.log('Error:', error);
        return res.status(500).json(error);
      });
  };

  // Handle item create on POST.
  controller.add = (req, res) => { };

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

  // Handle item create on POST.
  controller.addCommentary = (req, res) => { };

  // Display item update form on PUT.
  controller.updateCommentary = (req, res) => { };

  // Handle item delete on DELETE.
  controller.deleteCommentary = (req, res) => { };

  return controller;

};