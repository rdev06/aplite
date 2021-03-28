/**
 * Here we have to handle middleware functions also
 * We knew that first argument i.e path will always be an string
 */

module.exports = method =>
  function (path, ...fn) {
    if (typeof path !== 'string') throw new Error('First argument should always be string');
    if (!fn) return;
    this.fnStack.push({
      fn,
      method: method.toUpperCase(),
      path: typeof path === 'string' ? path : null
    });
  };
