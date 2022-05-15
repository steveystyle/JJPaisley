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
  await page.setViewport({
    width: 1200,
    height: 1500
  });
  await page.$eval(
    'a.test2',
    e => {
      e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    }
  );
  await page.waitForSelector('a.test2', { visible: true });
  await Promise.all([
    page.waitForNavigation(),
    page.click('a.test2'),
  ]);
  expect(page.url()).toBe(`http://localhost:${port}/about`);
  await browser.close();
});