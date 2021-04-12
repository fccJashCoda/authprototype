const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

const viewRouter = require('./api/view/view.router');
const auth = require('./auth/auth.router');

const port = 5333;

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.use('/user', viewRouter);
app.use('/auth', auth);

app.get('/', (req, res) => {
  res.json({ message: 'Hello world' });
});

app.use((req, res, next) => {
  console.log('error', req.error);
  next();
});

app.use((req, res, next) => {
  res.json({ message: '404 - page not found or something' });
});

mongoose
  .connect('mongodb://localhost:27017/science', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('database connected'))
  .catch((err) => console.log(err));

app.listen(port, console.log(`Server running on port ${port}`));

// https://levelup.gitconnected.com/react-template-for-jwt-authentication-with-private-routes-and-redirects-f77c488bfb85
