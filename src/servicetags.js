console.log("Lets download the service tag json")

const jsdom = require("jsdom");
const axios = require('axios');
const fs = require('fs');

axios
  .get('https://www.microsoft.com/en-us/download/details.aspx?id=56519')
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    const dom = new jsdom.JSDOM(res.data)
    const failoverlink = dom.window.document.querySelector(".dlcdetail__download-btn").href
    console.log(`Downloading: ${failoverlink}`)
    axios.get(failoverlink)
    .then(res => {
        const path = './src/ServiceTags_Public.json'
        fs.writeFile(path, JSON.stringify(res.data, null, 2), err => {
            if (err) {
              console.error(err);
            }
            console.log(`Writing to ${path} success`)
        });
          
          
    })
  })
  .catch(error => {
    console.error(error);
  });
