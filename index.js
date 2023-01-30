const { google } = require('googleapis');
const scrapAlgorithm = require('./scrapLogic')
const {decodeMailMessage, costAssociation} = require('./utilities')
const googleAuth = require('./googleAuth')

/**
 *
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */



async function searchMessagesPromerica(auth, dates){
  const scrappedData = await searchMessages(auth,{from: 'servicio@promerica.com.do', subject: 'Aviso de Transacción',  ...dates}, 'promerica')
  return scrappedData
}

async function searchMessagesBanreservas(auth,dates){
  let scrappedData = await searchMessages(auth, {from: 'julio5001@hotmail.com', subject: 'Notificaciones Banreservas', ...dates}, 'banreservas')
  scrappedData = [...scrappedData, ...(await searchMessages(auth, {from: 'julio5001@hotmail.com', subject: 'Recibo de la transacción',  ...dates}, 'banreservasTransfer'))]
  return scrappedData
}

async function searchMessages(auth, query, bank) {
  const gmail = google.gmail({ version: 'v1', auth });
  const scrappedData = []
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: `from:(${query.from}) after:${query.after} before:${query.before}  subject:(${query.subject})`,
  });
  const messages = res.data.messages;
  console.log(`Number of messages: ${messages?.length}`);
  if(messages){
    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      });
      if(bank == 'banreservas' || bank == 'banreservasTransfer'){
        msg.data.payload.parts.forEach((part, index) =>  {
          if(index == 1) {
            const htmlBody = decodeMailMessage(part.body.data);
            scrappedData.push(scrapAlgorithm[bank](htmlBody))
          }
        })
      }else if(bank == 'promerica'){      
        const promericaValidTransfer = msg.data.payload.headers.find(header => {
          if(header.name == 'Subject'){
            return header.value == 'Aviso de Transacción'
          }
          return false
        })
        if(promericaValidTransfer){
          const htmlBody = decodeMailMessage(msg.data.payload.body.data);
          scrappedData.push(scrapAlgorithm[bank](htmlBody))
        }
      }
    }
  }

  return scrappedData
}


async function getExpensesFromGmail(dates){
  const auth = await googleAuth()
  const dataPromerica = await searchMessagesPromerica(auth, dates)
  const dataBanreservas = await searchMessagesBanreservas(auth, dates)
  return [...dataPromerica, ...dataBanreservas]
}


module.exports = {
  getExpensesFromGmail
}

// route expenses resume
// logic to only query from actual month (day o) when not data exits and from last consult date when data exits (user field)
// Logic to save the data of expenses from query (data mapping)
// FRONT END - Init project create repo (tailwind, react)
// FRONT END - budget table
// FRONT END - expenses table / resume (tabs)
