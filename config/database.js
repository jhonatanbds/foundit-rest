const mongoose = require('mongoose');

module.exports = (uri) => {
  const myDB = mongoose.connect(uri);

  if (process.env.NODE_ENV !== 'test') {
    mongoose.connection.on('connected', () => {
      console.log(`Mongoose! Connected in ${uri}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log(`Mongoose! Disconnected from ${uri}`);
    });

    mongoose.connection.on('error', (error) => {
      console.log(`Mongoose! Connection Error: ${error}`);
    });

    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log('Mongoose! Disconnected by application termination');
        process.exit(0);
      });
    });
  }

  return myDB;
};
