const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const WrongUserError = require('../errors/wrong-user-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie, err) => {
      if (
        country
        && director
        && duration
        && year
        && description
        && image
        && trailer
        && nameRU
        && nameEN
        && thumbnail
        && movieId
      ) {
        return res.send(movie);
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return res.send(movie);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (String(movie.owner) !== req.user._id) {
        return next(new WrongUserError('Невозможно удалить чужой фильм'));
      }

      return Movie.findByIdAndRemove(req.params.id).then(() => {
        res.send(movie);
      });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
