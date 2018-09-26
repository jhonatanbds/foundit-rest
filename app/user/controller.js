const validator = require('validator');
const moment = require('moment');

module.exports = (app) => {
  const User = app.user.model;
  const Item = app.item.model;

  const controller = {};

  const USER_PROJECTION = '_id email fullName birthDate token';

  /**
   * Make an user object without unnecessary properties (e.g. mongo attributes)
   * @param {*} user mongoose object of user
   * @return {Object} lean user
   */
  const makeReturnedUser = (user) => {
    const userReturn = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      birthDate: user.birthDate,
      token: user.token
    };

    return userReturn;
  };

  /**
   * Check if an user (or its props) is valid or not.
   * @param {boolean} updating if it's updating or not; if not, email
   * and password are ignored
   * @param {object} user object that contains fullName, email and/or password
   */
  const validateUser = (
    updating,
    {
      fullName, birthDate, email, password
    }
  ) => {
    let isValid = true;
    isValid = fullName && isValid ? fullName.length >= 5 : isValid && updating;
    isValid = birthDate && isValid
        ? moment(birthDate).isValid() &&
        moment().diff(moment(birthDate), 'years') >= 18
        : isValid && updating;
    isValid = email && isValid ? validator.isEmail(email) : isValid && updating;
    isValid = password && isValid ? password.trim().length >= 6 : isValid && updating;
    return isValid;
  };

  /**
   * List all users. (Actually, there is no route for this.)
   * @param {*} req
   * @param {*} res
   * @return {Array} users
   */
  controller.list = (req, res) => {
    User.find({}, USER_PROJECTION)
      .sort({ fullName: 1 })
      .lean(true)
      .exec((error, users) => {
        if (error) {
          console.log(`error: ${error}`);
          return res.status(500).json(error);
        }
        return res.status(200).json(users);
      });
  };

  /**
   * Return user logged in.
   * @param {*} req
   * @param {*} res
   * @return {Object} user
   */
  controller.get = (req, res) => {
    const { _id } = req.user;
    User.findOne({ _id }, USER_PROJECTION)
      .lean(true)
      .exec((error, user) => {
        if (error) {
          console.log(`error: ${error}`);
          return res.status(500).json(error);
        }
        return res.status(200).json(user);
      });
  };

  /**
   * Add an user with passed properties
   * @param {*} req
   * @param {*} res
   * @return {Object} user
   */
  controller.add = (req, res) => {
    const {
      fullName, cnhExpiration, birthDate, email, password
    } = req.body;
    if (
      !validateUser(false, {
        fullName,
        cnhExpiration,
        birthDate,
        email,
        password
      })
    ) {
      return res.status(500).json(new Error('User invalid'));
    }
    const newUser = new User();
    newUser.fullName = fullName;
    newUser.cnhExpiration = cnhExpiration;
    newUser.birthDate = birthDate;
    newUser.email = email;
    newUser.password = newUser.generateHash(password);
    newUser.save((error, user) => {
      if (error) {
        console.log(`error: ${error}`);
        const errorToReturn = {};
        if (error.code === 1100) {
          errorToReturn.message = 'Já existe um usuário com esse email.';
        } else {
          errorToReturn.message =
            'Não foi possível criar usuário. Consulte um desenvolvedor do app.';
        }
        return res.status(500).json(errorToReturn);
      }

      return res.status(200).json(makeReturnedUser(user));
    });
  };

  /**
   * Update user logged in with body.
   * @param {*} req
   * @param {*} res
   * @return {Object} user updated
   */
  controller.update = (req, res) => {
    const { fullName, cnhExpiration, birthDate } = req.body;
    const data = {};
    if (fullName) data.fullName = fullName;
    if (cnhExpiration) data.cnhExpiration = cnhExpiration;
    if (birthDate) data.birthDate = birthDate;

    if (!validateUser(true, data)) {
      return res.status(500).json(new Error('User invalid'));
    }

    const { _id } = req.user;

    User.findOneAndUpdate({ _id }, data, { new: true })
      .lean(true)
      .exec((error, user) => {
        if (error) {
          console.log(`error: ${error}`);
          return res.status(500).json(error);
        }
        return res.status(200).json(makeReturnedUser(user));
      });
  };

  /**
   * Delete user logged in and his cars
   * @param {*} req
   * @param {*} res
   */
  controller.delete = (req, res) => {
    const { _id } = req.user;

    User.findByIdAndDelete(_id).exec((error) => {
      if (error) {
        console.log(`error: ${error}`);
        return res.status(500).json(error);
      }
      Car.deleteMany({ owner: _id })
        .exec()
        .then(() => res.status(200).end())
        .catch((err) => {
          console.log(`error: ${err}`);
          return res.status(500).json(err);
        });
    });
  };

  /**
   * Change password of logged user
   * @param {*} req
   * @param {*} res
   */
  controller.changePassword = (req, res) => {
    const { _id } = req.user;
    User.findOne({ _id })
      .exec()
      .then((user) => {
        if (user.verifyPassword(req.body.oldPassword)) {
          const data = {};
          data.password = user.generateHash(req.body.password);

          User.findOneAndUpdate({ _id }, data, { new: false })
            .lean(true)
            .exec((err) => {
              if (err) {
                console.log(`error: ${err}`);
                return res.status(500).json(err);
              }
              return res.status(200).end();
            });
        } else {
          return res.status(500).end();
        }
      })
      .catch((error) => {
        console.log(`error: ${error}`);
        return res.status(500).json(error);
      });
  };

  return controller;
};
