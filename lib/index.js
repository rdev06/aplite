const http = require('http');
const { EventEmitter } = require('events');
const handleMethod = require('./handleMethod');
const methods = ['get', 'post', 'put', 'delete'];

class Aplite extends EventEmitter {
  store = [];
  listen(port = 3000, host = '0.0.0.0') {
    port = parseInt(port);
    return new Promise((resolve, reject) => {
      if (!Number.isInteger(port)) reject('port must be integer');
      http.createServer(this.emitter.bind(this)).listen(port, host, () => resolve());
    });
  }
  emitter(req, res) {
    // Todo: Something that can return 404 if no route found
    if (req.url == '/favicon.ico') {
      res.end('Can not GET /favicon.ico');
      return;
    }
    this.emit(`${req.method}.${req.url}`, { req, res });
  }
  use(path, fn) {
    if (typeof path === 'function') fn = path;
    if (!(fn && typeof fn === 'function')) throw new Error('Middlewares must be a kind of function');
    this.store.push({
      path: typeof path === 'string' ? path : null,
      fn
    });
  }
}

methods.forEach(method => (Aplite.prototype[method] = handleMethod(method)));

module.exports = new Aplite();
