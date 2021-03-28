const app = require('./lib');

app.get('/', (req, res) => res.send('Hello world'));

app.listen(3000).then(() => console.log('server is up'));
