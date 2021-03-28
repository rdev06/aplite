const execute = require('./execute');

module.exports = method =>
  function (path, ...fn) {
    const self = this;
    self.on(`${method.toUpperCase()}.${path}`, ({ req, res }) => {
      const netFn = self.store
        .filter(stack => !stack.path || stack.path === path)
        .map(stack => stack.fn)
        .concat(fn);
      execute(req, res, netFn);
    });
  };
