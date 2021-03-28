module.exports = function (res, url) {
  let address = url;
  let status = 302;
  if (arguments.length === 3) {
    if (typeof arguments[1] === 'number') {
      status = arguments[1];
      address = arguments[2];
    }
  }

  const responseBody = 'Redirecting to ' + address;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Length', Buffer.byteLength(responseBody));
  res.setHeader('Location', address);
  res.writeHead(status, res.headerValues);
  res.end(responseBody);
};
