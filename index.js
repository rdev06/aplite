const app = require('./lib');

app.use((req, res, next) => {
  console.log('global middleware');
  next();
});

const middleware = (req, res, next) => {
  console.log('m1 init');
  next();
};

app.get('/', middleware, (req, res) => {
  res.send('first working');
});

app.listen().then(() => console.log('server is up at port 3000'));
