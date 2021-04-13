const jwt = require('jsonwebtoken');
const User = require('../../models/users');

// check if a cookie is stored in the browser, if there is, try and get the user from the database and
// send it back to the front end
// NOTE: yes, the secret key is exposed. This is not production code!, just a little demo to check how to
// use httponly cookies and play with react context
// also, we're sending the password to the frontend right now, totally intentional :cough:
const checkUser = async (req, res, next) => {
  let currentUser;
  console.log('check user');

  if (req.cookies.jwt) {
    console.log('cookie found');
    try {
      const token = req.cookies.jwt;
      const decoded = await jwt.verify(token, 'battlekitten');
      currentUser = await User.findById(decoded.id);
    } catch (error) {
      next(error);
    }
  } else {
    currentUser = null;
  }

  console.log(currentUser);

  res.status(200).send({ currentUser });
};
module.exports = {
  checkUser,
};
