const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');
const { Console } = require('console');
const { url } = require('inspector');
const output = 'y.txt';
const Path_csv = './input.txt';
const id_youtube=[];
const name = [];
let link = [];
let url_check = [{key:',',value:''},]
var is = 0;
const begin =0;
const end = 0;
(async () => {
  let browser;
  try {
    let y='';
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
    const requestUrl = interceptedRequest.url();
      if (requestUrl.includes('/0.js')) {
        console.log(`Intercepted request: ${interceptedRequest.method()} ${requestUrl}`);
         y = requestUrl;
      }
         if(requestUrl.includes('0.jpg')){
          console.log(`Intercepted request: ${interceptedRequest.method()} ${requestUrl}`);
          name.push(data[is].LinkSong)
          console.log(y)
          link.push(y);
          id_youtube.push(requestUrl);
          interceptedRequest.abort();
        }
      interceptedRequest.continue();
    });

    const fileContent = await fs.readFile(Path_csv, 'utf8');
    const rows = fileContent.trim().split('\n');
    const data = rows.map(row => {
      const columns = row.split('\t');
      return {
        ID: columns[0],
        SongName: columns[1],
        LinkSong: columns[2],
        LinkJs: columns[3]
      };
    });

    for (let i = 4000; i <5000; i++) {
      is=i;
      console.log(`Process ${i + 1}/${1000}`);
      console.log('Navigating to:', data[i].LinkSong);
      try {
        await page.goto(data[i].LinkSong, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#control-play');
        await new Promise(resolve => setTimeout(resolve, 1200));
        await page.click('#control-play');
        await new Promise(resolve => setTimeout(resolve, 1200));
        await page.click('#control-play');
        await new Promise(resolve => setTimeout(resolve, 1200));
    } catch (error) {
        console.error('Error navigating to URL:', error.message);
      }
    }
    // for(let i of url_check){
    //   console.log(`link ${i.key} active ${i.value}`)
    //   if(!i.value){
    //     link.push(i.key)
    //   }
    // }
    console.log()
    console.log(id_youtube);
    console.log(name);
    console.log(link);
    continueScript();
  } catch (err) {
    console.error("Error: ", err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();

async function continueScript() {
  // const formattedOutput = Array.from(id_youtube).map((url, index) => {
  //   const link = link[index];
  //   return `${id}\t${url}\t${JSON.stringify(name[index], null, 2)}\n`;
  // }).join('');

  // await writeToFile(output, formattedOutput);
  const combinedData = id_youtube.map((id, index) => [id, name[index], link[index]]);
  const dataToWrite = combinedData.map(row => row.join('\t')).join('\n');

  await writeToFile(output, dataToWrite);
}

async function writeToFile(output, data) {
  try {
    await fs.writeFile(output, data + '\n\n', { flag: 'a' });
    console.log(`Data written to ${output}`);
  } catch (err) {
    console.error(`Error writing to file ${output}: ${err.message}`);
  }
}

async function downloadFile(url, identifier) {
    try {
      const response = await axios.get(url);
      const jsonData = response.data;
  
      const outputFileName = `./1001_result_10/${identifier}.json`;
      await fs.writeFile(outputFileName, JSON.stringify(jsonData, null, 2));
  
      console.log(`JSON data saved to ${outputFileName}`);
    } catch (error) {
      console.error(`Error fetching or saving JSON from ${url}:`, error.message);
    }
  }