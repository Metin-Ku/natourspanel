const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

console.log('66666666666666666666');

const i18next = require('i18next');
const i18backend = require('i18next-fs-backend');
const i18middleware = require('i18next-http-middleware');

const AppError = require('./utils/appError');

console.log('1');

const globalErrorHandler = require('./controllers/errorController');

console.log('2');

const tourRouter = require('./routes/tourRoutes');

console.log('3');

const userRouter = require('./routes/userRoutes');

console.log('4');

const reviewRouter = require('./routes/reviewRoutes');

console.log('5');

const bookingRouter = require('./routes/bookingRoutes');

console.log('6');

const difficultyRouter = require('./routes/difficultyRoutes');

console.log('7');

const roleRouter = require('./routes/roleRoutes');

console.log('8');

const sliderRouter = require('./routes/sliderRoutes');

console.log('9');

const viewRouter = require('./routes/viewRoutes');

console.log('11');

const adminViewRouter = require('./routes/Admin/viewRoutes');

console.log('xxxxxxxxxxxxxxxxxxxxxxxxx');

const supportedLanguages = ['en', 'tr'];
const fallbackLanguage = 'en';

console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');

// middle ware of i18next adding a function to request and from that request(req) we get translation
i18next
  .use(i18backend)
  .use(i18middleware.LanguageDetector)
  .init({
    fallbackLng: fallbackLanguage,
    supportedLngs: supportedLanguages,
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
  });

console.log('7777777777777777');

const app = express();
app.use(i18middleware.handle(i18next));

console.log('8888888888888888888');

// Custom handling for LanguageDetector
i18next.on('languageChanged', (lng) => {
  if (!supportedLanguages.includes(lng)) {
    // If the detected language is not in the supported languages, fallback to the default language
    i18next.changeLanguage(fallbackLanguage);
  }
});

app.get('/change-language/:lang', (req, res) => {
  // there is req.language on viewsController
  const { lang } = req.params;
  res.cookie('i18next', lang); // Store grammar information in cookie
  req.i18n.changeLanguage(lang); // Perform the language change operation
  res.redirect('/');
});
console.log('9999999999999999999');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

// 1) GLOBAL MIDDLEWARES

// Serving static files
// css, favicon dosyaları aşağıdaki kod sayesinde yükleniyor
// app.use(express.static(`${__dirname}/public`));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log('1010000000000000000000000000000000');

// Aynı ip'den çok istek atmasını engellemek için limit. Güvenlik önlemi. 1 saatte 100 istek. Bu proje için iyi bir limit ama farklı projelerde daha fazla isteğe ihtiyaç olursa arttırılabilir
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanization against XSS
// *** Clean any user input from malicious html code
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 🖐');
//   next();
// });

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

app.get('/api/v1/example', (req, res) => {
  res.send('Bu bir örnek API endpointidir.');
});
console.log('12222222222222222');

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/sliders', sliderRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/difficulties', difficultyRouter);
app.use('/api/v1/roles', roleRouter);

app.use('/panel', adminViewRouter);
// tüm http requestlerde çalışması için all koyuldu. * ise tüm urller için
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
