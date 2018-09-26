const passport = require('passport');

module.exports = {
  /**
   * Check if it's logged in.
   */
  isLoggedIn: passport.authenticate('bearer', { session: false })
};
