const PROXY_TARGET = "http://localhost:8080";
const FAKE_ORIGIN = "http://localhost:4200";

/** @type {Record<string, import('http-proxy-middleware').Options>} */
const PROXY_CONFIG = {
  "/post": {
    target: PROXY_TARGET,
    secure: false,
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Origin", FAKE_ORIGIN);
    },
  },
  "/users": {
    target: PROXY_TARGET,
    secure: false,
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Origin", FAKE_ORIGIN);
    },
  },
  "/comments": {
    target: PROXY_TARGET,
    secure: false,
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Origin", FAKE_ORIGIN);
    },
  },
  "/subscape": {
    target: PROXY_TARGET,
    secure: false,
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Origin", FAKE_ORIGIN);
    },
  },
};

module.exports = PROXY_CONFIG;
