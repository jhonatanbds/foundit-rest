const mongoose = require('mongoose');

module.exports = (uri) => {
  const myDB = mongoose.connect(uri, { useNewUrlParser: true });
  
  const admin = async () => {
    const User = mongoose.model('User');
    try {
      const users = await User.find().exec();
      if (!users.length) {
        const newUser = new User();
        newUser.fullName = 'Admin Example';
        newUser.birthDate = new Date('1997-01-01');
        newUser.email = 'admin@email.com';
        newUser.password = newUser.generateHash('eutenhoumviolaorosa');
        await newUser.save();
        console.log('First user created!');
      }
      console.log('Admin already in db');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  if (process.env.NODE_ENV !== 'test') {
    mongoose.connection.on('connected', () => {
      admin().then(() => {
        console.log(`Mongoose! Connected in ${uri}`);
      });
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
