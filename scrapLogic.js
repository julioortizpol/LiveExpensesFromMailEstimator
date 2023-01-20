
const cheerio = require('cheerio');

function scrapMessageDataPromerica(html) {
    const $ = cheerio.load(html);
    const tableRow = {};
    const tableInfoIndex = {
      3: 'status',
      4: 'amount',
      5: 'business',
      6: 'date',
      7: 'id',
      8: 'country',
    };
    $('table > tbody > tr').each((index, element) => {
     
      if (tableInfoIndex[index]) {
        const tds = $(element).find('td');
        const [head, content] = tds;
        tableRow[tableInfoIndex[index]] =
          index == 3 ? $(head).text() : $(content).text();
      }
    });
    return tableRow
  }

  function scrapMessageDataBanreservas(html) {
    const $ = cheerio.load(html);
    const tableRow = {};
    const tableInfoIndex = {
      0: 'date',
      1: 'currency',
      2: 'amount',
      3: 'business',
      4: 'state',
    };
    $("table > tbody > tr").each((index, element) => {
      if (index === 0) {
        return true;
      }
      const tds = $(element).find("td");
      $(tds).each((i, element) => {
        if(tableInfoIndex[i]){
          tableRow[tableInfoIndex[i]] = $(element).text().replace("\n","");
        } 
      });
    });
    return tableRow
  }
  
  function scrapMessageDataBanreservasTransfers(html) {
    const $ = cheerio.load(html);
    const tableRow = {};
    const tableInfoIndex = {
      14: 'date',
      2: 'business',
      8: 'amount',
      6: 'receptorAccount',
      16: 'id',
    };
    $("table > tbody > tr").each((index, element) => {
      if (index === 0) {
        return true;
      }
      const tds = $(element).find("td");
      $(tds).each((i, element) => {
        if(tableInfoIndex[i]){
          tableRow[tableInfoIndex[i]] = $(element).text().replace("\n","");
        } 
      });
    });
    return tableRow
  }
module.exports = {
    promerica: scrapMessageDataPromerica,
    banreservas: scrapMessageDataBanreservas,
    banreservasTransfer: scrapMessageDataBanreservasTransfers
}