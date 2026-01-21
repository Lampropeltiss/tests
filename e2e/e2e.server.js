const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.dev');

const compiler = webpack(config);
const server = new WebpackDevServer(config.devServer || {}, compiler);

server.startCallback(() => {
  console.log(`DevServer запущен на http://${config.devServer?.host || 'localhost'}:${config.devServer?.port || 8080}`);
  
  if (process.send) {
    process.send('ok');
  }
});