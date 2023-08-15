
exports.module = async function logNavigationAndNetwork(page) {
    page.on('request', (request) => {
      console.log('Request:', request.method(), request.url());
    });
  
    page.on('response', (response) => {
      console.log('Response:', response.status(), response.url());
    });
  
    page.on('requestfinished', (request) => {
      console.log('Request finished:', request.url());
    });
  
    page.on('requestfailed', (request) => {
      console.log('Request failed:', request.url());
    });
  
    page.on('domcontentloaded', () => {
      console.log('DOM content loaded');
    });
  
    page.on('load', () => {
      console.log('Page load event');
    });
  }