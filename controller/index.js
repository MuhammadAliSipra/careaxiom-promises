const Q = require('q');
const { generateHtmlCodeForResponse, fetchTitle } = require("../utils/getHtmlCode");

const getUrlsToGtTitles = async (req,res) =>{
    const addresses = req.query.address;

    if (!addresses) {
      return res.status(400).send('No address provided');
    }
  
    const addressArray = Array.isArray(addresses) ? addresses : [addresses];
    
    // Map over addresses and fetch titles
    const promises = addressArray.map((address) => {
      let url = address.startsWith('http') ? address : `http://${address}`;
      return fetchTitle(url).then(title => {
        return `<li>${url} - "${title}"</li>`;
      });
    });
  
    // Wait for all promises to resolve
    Q.all(promises).then((results) => {
        const htmlCode = generateHtmlCodeForResponse(results)
        res.status(200).send(htmlCode);
    });
}


module.exports =  { getUrlsToGtTitles }