import { connect, ConnectOptions } from 'mongoose';

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

console.log(url)
const options: ConnectOptions = {
};

connect(url, options).then(function () {
  console.log('MongoDB is connected');
}).catch(function (err: any) {
  console.log('database connection failed. exiting now...');
  console.error(err);
  process.exit(1);
});
