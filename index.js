const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const tabletojson = require('tabletojson').Tabletojson;
const scrapAlgorithm = require('./scrapLogic')
const {decodeMailMessage, costAssociation} = require('./utilities')
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
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

authorize().then(searchMessagesBanreservas).catch(console.error);


/* 
Expenses from mail:
  userId,
  Amount
  business
  date
  status
  bank
  pureFromMail
  budgetCatgegory
  tag

Logic to get last consult date, ()
AutoMatch Logic

Users:
  name,
  mail,
  lasConsultDate

tah -> Things to globally clasify expneses

budget
  title,
  amount,
  user
  

*/