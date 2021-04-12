const jwt = require('jsonwebtoken');
const User = require('../models/users');

const signToken = (id) => jwt.sign({ id }, 'battlekitten', { expiresIn: '1h' });

const createUserToken = async (user, code, req, res) => {
  const token = signToken(user._id);

  let date = new Date();
  date.setDate(date.getDate() + 30);

  res.cookie('jwt', token, {
    expires: date,
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    samesite: 'none',
  });

  // console.log('res cookie', res.cookie());
  console.log('res cookie set');

  user.password = undefined;
  res.status(code).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const registerUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({
      username,
      password,
    });

    await newUser.save().then(() => createUserToken(newUser, 201, req, res));
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log('login user: ', user);
    console.log('login password entered', password);

    if (!user || password !== user.password) {
      throw new Error('User has left the building');
    }
    createUserToken(user, 200, req, res);
  } catch (error) {
    next(error);
  }
};

const logoutUser = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).send('logout user');
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
