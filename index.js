const http = require('http');
const app = require('./config/express')();

const port = app.get('port');

http.createServer(app).listen(port, () => {
  console.log(`Express Server listening on port ${port}`);
});
