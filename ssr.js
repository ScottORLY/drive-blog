'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');

const compiler = Webpack({mode: "production", ...webpackConfig});
const server = new WebpackDevServer(compiler, webpackConfig.devServer);

const render = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8080/drive-blog', {waitUntil: 'networkidle0'});
    await page.waitForSelector('div');

  } catch (err) {
    console.error(err);
    server.close();
    throw new Error('page.goto/waitForSelector timed out.');
  }
  
  await page.evaluate(() => {
      document.querySelectorAll('script').forEach(element => {
          element.remove();
      });
  });


  const html = await page.content();
  await browser.close();

  fs.writeFile('./docs/index.html', html, () => {
    server.close();
  });
}

server.listen(8080, 'localhost', () => {
  render();
});

