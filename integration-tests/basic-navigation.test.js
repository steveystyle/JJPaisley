const portfinder = require('portfinder');
const puppeteer = require('puppeteer');

const app = require('../index.js');

let server = null;
let port = null;

beforeEach(async () => {
  port = await portfinder.getPortPromise();
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

test('home page links to about page', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}`);
  await page.waitForSelector('a');

  const aresult = await page.$eval('.test2');

  console.log(aresult);



  // expect(page.url()).toBe(`http://localhost:${port}/about`);
  await browser.close();
});