// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = 'AC2deffb9655d346d5d779637eb555d5a3';
const authToken = '27018b815dbc86ebcb04878ad3404d8a';
const client = require('twilio')(accountSid, authToken);

client.verify.services('VAc199440939388c7eb0d6d9387e5fd657')
             .verificationChecks
             .create({to: '+2348171551089', code: '444060'})
             .then(verification_check => console.log(verification_check));

