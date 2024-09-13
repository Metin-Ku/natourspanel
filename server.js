console.log('1111111111111111');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

console.log('222222222222222222222222');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
console.log('333333333333333333333');

dotenv.config({ path: './config.env' });
console.log('4444444444444444444444');

const app = require('./app');

console.log('55555555555555555555555555');

console.log('process.env.DATABASE: ', process.env.DATABASE);
console.log('process.env.DATABASE_PASSWORD:: ', process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
