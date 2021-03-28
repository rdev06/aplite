const http = require('http');
const handleMethod = require('./handleMethod');
const { EventEmitter } = require('events');
const execute = require('./execute');
const send = require('./send');
const redirect = require('./redirect');

class Aplite extends EventEmitter {
  fnStack = [];

  use(path, fn) {
    if (typeof path === 'function') fn = path;
    if (!fn) throw new TypeError('middleware must be a function!');
    this.fnStack.push({
      fn,
      method: null,
      path: typeof path === 'string' ? path : null
    });
  }

  pathMatch(requestPath, stackPath) {
    return {
      match: requestPath === stackPath,
      reqOption: {
        query: {},
        params: {
          id: 'roshan'
        }
      }
    };
  }

  getFunctionList(requestPath, method) {
    const toSend = {};
    for (const fun of this.fnStack) {
      if (fun.method === method) {
        const isMatch = this.pathMatch(requestPath, fun.path);
        if (isMatch.match && fun.fn.length) Object.assign(toSend, { func: fun.fn, reqOption: isMatch.reqOption });
      }
    }
    return toSend;
  }

  callbackNextFunction(req, res, callbackStack) {
    const self = this;
    if (callbackStack.length === 0) {
      return;
    }
    callbackStack[0] &&
      callbackStack[0].call &&
      callbackStack[0].call(this, req, res, function () {
        callbackStack.shift();
        self.callbackNextFunction(req, res, callbackStack);
      });
  }

  status(res, code) {
    res.statusCode = code;
    return res;
  }

  header(res, key, value) {
    if (typeof res.headerValues === 'undefined') {
      res.headerValues = {};
    }
    res.headerValues[key] = value;
  }

  async listen(port = 3000, hostname = '0.0.0.0') {
    const httpServer = http.createServer(this.execute.bind(this)).listen(port, hostname);
    if (httpServer) {
      this.emit('ready');
      return;
    }
  }
}

const methods = ['get', 'post', 'put', 'delete'];
methods.forEach(method => (Aplite.prototype[method] = handleMethod(method)));

Aplite.prototype.execute = execute;
Aplite.prototype.send = send;
Aplite.prototype.redirect = redirect;

module.exports = new Aplite();
