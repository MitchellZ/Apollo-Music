// netlify/functions/proxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

exports.handler = createProxyMiddleware({
  target: 'http://playlist.us.to:5000',
  pathRewrite: {
    '^/api': '', // remove the '/api' prefix when forwarding requests
  },
  changeOrigin: true,
});
