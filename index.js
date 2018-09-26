const http = require('http');
const app = require('./config/express')();

const mongoUri = process.env.MONGODB_URI;

require('./config/passport')();
require('./config/database')(mongoUri || 'mongodb://localhost/road');

require('./config/database')(mongoUri || 'mongodb://localhost/foundit');

const port = app.get('port');

http.createServer(app).listen(port, () => {
  console.log(`Express Server listening on port ${port}`);
});
