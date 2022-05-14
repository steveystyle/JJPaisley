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
  await page.setRequestInterception(true);
  page.on('request', (request) =>{
    request.url().endsWith('.png').abort();
  });
    
  
  await page.goto(`http://localhost:${port}`);




 // expect(page.url()).toBe(`http://localhost:${port}/about`);
  await browser.close();
});