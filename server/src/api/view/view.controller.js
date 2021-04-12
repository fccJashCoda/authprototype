const jwt = require('jsonwebtoken');
const User = require('../../models/users');

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
