const uuid = require('uuid');

module.exports = (app) => {
  const User = app.models.user;

  const controller = {};

  /**
   * Login method. Require email and password in req.body
   * @param {*} req
   * @param {*} res
   * @return {Object} user with token
   */
  controller.login = (req, res) => {
    User.findOne({ email: req.body.email })
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(400).end();
        }
        if (!user.verifyPassword(req.body.password)) {
          return res.status(400).end();
        }

        User.findByIdAndUpdate(user._id, { token: uuid.v4() }, { new: true })
          .exec()
          .then((result) => {
            const {
              _id, fullName, email, token
            } = result;
            return res.status(200).json({
              _id,
              fullName,
              email,
              token
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).end();
      });
  };

  /**
   * Logout method. Require only an _id in req.body
   * @param {*} req
   * @param {*} res
   */
  controller.logout = (req, res) => {
    const { _id } = req.user;
    User.findByIdAndUpdate(_id, { token: null }, (error) => {
      if (error) {
        console.log('Error: ', error);
        return res.status(500).json(error);
      }
      return res.status(200).json({ message: 'Logout' });
    });
  };

  return controller;
};
