const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { default: validator } = require('validator');
const controller = require('../controllers/movies');

router.get('/', controller.getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2),
      director: Joi.string().required().min(2),
      duration: Joi.number().required(),
      year: Joi.string().required().min(2),
      description: Joi.string().required().min(2),
      nameRU: Joi.string().required().min(2),
      nameEN: Joi.string().required().min(2),
      movieId: Joi.number().required().min(2),
      image: Joi.string().required().min(2).custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле image заполнено некорректно');
      }),
      trailer: Joi.string().required().min(2).custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле trailer заполнено некорректно');
      }),
      thumbnail: Joi.string().required().min(2).custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле thumbnail заполнено некорректно');
      }),
    }),
  }),
  controller.postMovie,
);

router.delete(
  '/:id',
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().required().min(24).max(24)
          .hex(),
      })
      .unknown(true),
  }),
  controller.deleteMovie,
);

module.exports = router;
