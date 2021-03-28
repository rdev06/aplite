const app = require('./lib');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen().then(() => console.log('server is up at port 3000'));
