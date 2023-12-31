import express from "express"
let router = express.Router()
import fetch from 'node-fetch'

const token = process.env.WHATSAPP_TOKEN

router.use(express.json())

router.post("/", async (req, res) => {
    // Parse the request body from the POST
    let body = req.body;
  
    // Check the Incoming webhook message
    console.log(JSON.stringify(req.body, null, 2));
  
    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        //console.log(msg_body)
        //console.log(user)
        //read users from the json 
        try {
           let sendWhatsappMessage = await fetch(`https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${token}`,{
           method : 'post',
           headers : { "content-type" : "application/json"},
           text : { body : 'the bot is working' }
        })
        
  
        let whatsappResponse = await sendWhatsappMessage.json()
        console.log(whatsappResponse)
        // console.log(whatsappResponse)
        }catch (e) {
          console.log(e)
        }
     
    }
  
      res.sendStatus(200);
  
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  });


  //facebook token authentication
  router.get("/", (req, res) => {
    /**
     * UPDATE YOUR VERIFY TOKEN
     *This will be the Verify Token value when you set up webhook
    **/
    const verify_token = process.env.VERIFY_TOKEN;
    //const verify_token = "loan"
  
    // Parse params from the webhook verification request
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === "subscribe" && token === verify_token) {
        // Respond with 200 OK and challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  })

  router.get('/test', (req, res) => {
    res.send('its working')
  })

  export default router