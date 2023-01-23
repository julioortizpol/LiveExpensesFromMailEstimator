const { google } = require('googleapis');
const scrapAlgorithm = require('./scrapLogic')
const {decodeMailMessage, costAssociation} = require('./utilities')
const googleAuth = require('./googleAuth')

/**
 *
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */



async function searchMessagesPromerica(auth){
  const scrappedData = await searchMessages(auth,{from: 'servicio@promerica.com.do', subject: 'Aviso de Transacción'})
  costAssociation(scrappedData)
}

async function searchMessagesBanreservas(auth){
  let scrappedData = await searchMessages(auth, {from: 'julio5001@hotmail.com', subject: 'Notificaciones Banreservas'}, 'banreservas')
  scrappedData = [...scrappedData, ...(await searchMessages(auth, {from: 'julio5001@hotmail.com', subject: 'Recibo de la transacción'}, 'banreservasTransfer'))]
  costAssociation(scrappedData)
}

async function searchMessages(auth, query, bank) {
  const gmail = google.gmail({ version: 'v1', auth });
  const scrappedData = []
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: `from:(${query.from}) after:2023/01/01 subject:(${query.subject})`,
  });
  const messages = res.data.messages;
  console.log(`Number of messages: ${messages.length}`);
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
    }else {
      const htmlBody = decodeMailMessage(msg.data.payload.body.data);
      scrappedData.push(scrapAlgorithm[bank](htmlBody))
    }
  }
  return scrappedData
}


async function getExpensesFromGmail(){
  const auth = await googleAuth()
  searchMessagesBanreservas(auth)
}

getExpensesFromGmail()

// route expenses resume
// 