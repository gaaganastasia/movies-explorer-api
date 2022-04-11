const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { isCelebrateError } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./routes/index.js');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
require('dotenv').config();

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb+srv://gaaganastasia:Mbspchnu@ndthwm.ylfhy.mongodb.net/bitfilmsdb?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('mongo connected'))
  .catch((err) => {console.log(err)});

app.use(requestLogger);
app.use(limiter);

app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

// eslint-disable-next-line no-unused-vars
app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    return next({
      statusCode: 400,
      message: err.message,
    });
  }
  return next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
