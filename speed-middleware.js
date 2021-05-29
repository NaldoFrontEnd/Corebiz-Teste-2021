var disableCompression, errorHandler, ignoreReplace, replaceHtmlBody;

ignoreReplace = [/\.js(\?.*)?$/, /\.css(\?.*)?$/, /\.svg(\?.*)?$/, /\.ico(\?.*)?$/, /\.woff(\?.*)?$/, /\.png(\?.*)?$/, /\.jpg(\?.*)?$/, /\.jpeg(\?.*)?$/, /\.gif(\?.*)?$/, /\.pdf(\?.*)?$/];

replaceHtmlBody = function(environment, portalHost) {
    return function(req, res, next) {
        var data, end, proxiedHeaders, proxiedStatusCode, write, writeHead;

        if (ignoreReplace.some(function(ignore) {
            return ignore.test(req.url);
        })) {
            return next();
        }

        data = '';
        write = res.write;
        end = res.end;
        writeHead = res.writeHead;
        proxiedStatusCode = null;
        proxiedHeaders = null;
        res.writeHead = function(statusCode, headers) {
            proxiedStatusCode = statusCode;
            return proxiedHeaders = headers;
        };

        res.write = function(chunk) {
            return data += chunk;
        };

        res.convertToHttps = function (data, host) {
          var oldUrl = 'https://' + host
          var newUrl = 'http://' + host
          var oldUrlBigger = 'https://www.' + host
          var newUrlBigger = 'http://www.' + host

          return data.replace(new RegExp(oldUrl, 'g'), newUrl).replace(new RegExp(oldUrlBigger, 'g'), newUrlBigger)
        }

        res.end = function(chunk, encoding) {
            if (chunk) {
              data += chunk;
            }

            if (data) {

              data = res.convertToHttps(data, portalHost)

              var vtexlocal = portalHost.replace(new RegExp(environment, "g"), "vtexlocal")
              data = res.convertToHttps(data, vtexlocal)

              //fix img
              var vteximg = portalHost.replace(new RegExp(environment, "g"), "vteximg")
              data = res.convertToHttps(data, vteximg)

              // change environment
              data = data.replace(new RegExp(environment, 'g'), 'vtexlocal');
              data = data.replace(new RegExp('fossil.vteximg', 'g'), 'timecenter.vtexlocal');
            }

            res.write = write;
            res.end = end;
            res.writeHead = writeHead;

            if(proxiedHeaders){
                delete proxiedHeaders['content-security-policy'];
                proxiedHeaders['content-length'] = Buffer.byteLength(data);
                res.writeHead(proxiedStatusCode, proxiedHeaders);
            }

            return res.end(data, encoding);
        };

        return next();
    };
};

disableCompression = function(req, res, next) {
  req.headers['accept-encoding'] = 'identity';
  return next();
};

errorHandler = function(err, req, res, next) {
  var errString, ref, ref1;
  errString = (ref = (ref1 = err.code) != null ? ref1.red : void 0) != null ? ref : err.toString().red;
  return console.log(errString, req.url.yellow);
};

module.exports = {
  replaceHtmlBody: replaceHtmlBody,
  disableCompression: disableCompression,
  errorHandler: errorHandler
};
