module.exports = function (req, res) {
  const { func, reqOption } = this.getFunctionList(req.url, req.method);
  if (!func || !func.length) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`Can not ${req.method} ${req.url}`);
    return;
  }
  req.params = reqOption.params;
  req.query = reqOption.query;
  const callbackStack = this.fnStack
    .filter(fun => !fun.method && !fun.path)
    .map(fun => fun.fn)
    .concat(func);
  res.statusCode = 200;
  res.status = this.status.bind(this, res);
  res.send = this.send.bind(this, res);
  res.redirect = this.redirect.bind(this, res);
  res.header = this.header.bind(this, res);

  const firstFunc = callbackStack.shift();
  const self = this;
  try {
    firstFunc.call(this, req, res, function () {
      self.callbackNextFunction(req, res, callbackStack);
    });
  } catch (e) {
    this.emit('error', e, res, req);
  }
};
