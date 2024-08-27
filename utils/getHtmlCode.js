const axios = require('axios');
const Q = require('q');

const generateHtmlCodeForResponse = (listItems)=>{
    const htmlResponse = `
    <html>
    <head></head>
    <body>
        <h1>Following are the titles of given websites:</h1>
        <ul>
            ${listItems.join('')}
        </ul>
    </body>
    </html>`;


    return htmlResponse;
}

function fetchTitle(url) {
    return Q(axios.get(url))
      .then(response => {
        const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
        return titleMatch ? titleMatch[1].trim() : 'NO TITLE FOUND';
      })
      .catch(() => {
        // If the initial request fails, try switching from http to https or vice versa
        if (url.startsWith('http://')) {
          url = url.replace('http://', 'https://');
        } else if (url.startsWith('https://')) {
          url = url.replace('https://', 'http://');
        } else {
          // If the URL didn't start with http/https, we assume it is http initially
          url = `https://${url}`;
        }
        return Q(axios.get(url))
          .then(response => {
            const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
            return titleMatch ? titleMatch[1].trim() : 'NO TITLE FOUND';
          })
          .catch(() => {
            return 'NO RESPONSE';
          });
      });
  }


module.exports = { generateHtmlCodeForResponse, fetchTitle}