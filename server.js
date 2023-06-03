const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('Закрытие программы! 💥');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({path: './config.env'});

const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log('DB connection was established successfully!'))

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('Закрытие программы! 💥');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
})
