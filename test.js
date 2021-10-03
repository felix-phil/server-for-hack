const accountSid = 'AC2deffb9655d346d5d779637eb555d5a3'; 
const authToken = '27018b815dbc86ebcb04878ad3404d8a'; 
const client = require('twilio')(accountSid, authToken); 
 const otp = '12345'
client.messages 
      .create({ 
         body: `Use ${otp} to verify your number on hack chat`,  
         messagingServiceSid: 'MG9dc7e1ab9a4c4def71f4a8932b292ba8',      
         to: '+2348171551089' 
       }) 
