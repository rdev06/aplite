function execute(req, res, funcs) {
  const firstFunc = funcs.shift();
  res.statusCode = 200;
  res.status = status.bind(res);
  res.send = send.bind(res);
  firstFunc(req, res, () => callbackNextFunction(req, res, funcs));
}

function callbackNextFunction(req, res, callbackStack) {
  if (callbackStack.length === 0) {
    return;
  }
  callbackStack[0] &&
    callbackStack[0](req, res, () => {
      callbackStack.shift();
      callbackNextFunction(req, res, callbackStack);
    });
}

function status(code) {
  this.statusCode = code;
  return this;
}
function send(data) {
  if (this.finished) {
    return;
  }
  const contentType = 'text/plain';
  const responseBody = data;
  if (typeof data === 'object') {
    contentType = 'application/json';
    responseBody = JSON.stringify(data);
  }
  this.setHeader('Content-Type', contentType);
  this.setHeader('Content-Length', Buffer.byteLength(responseBody));
  this.writeHead(this.statusCode, this.headerValues);
  this.end(responseBody);
}

module.exports = execute;
