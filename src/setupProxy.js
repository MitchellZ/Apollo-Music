const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // specify the endpoint you want to proxy
    createProxyMiddleware({
      target: 'http://playlist.us.to:5000', // specify the target URL where requests should be forwarded
      changeOrigin: true, // changes the origin of the host header to the target URL
      pathRewrite: {
        '^/api': '', // remove the '/api' prefix when forwarding requests
      },
    })
  );
};
