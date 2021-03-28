module.exports = function (res, data) {
  if (res.finished) {
    return;
  }
  const contentType = 'text/plain';
  const responseBody = data;
  if (typeof data === 'object') {
    contentType = 'application/json';
    responseBody = JSON.stringify(data);
  }
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', Buffer.byteLength(responseBody));
  res.writeHead(res.statusCode, res.headerValues);
  res.end(responseBody);
};
