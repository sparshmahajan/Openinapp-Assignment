import twilio from "twilio";
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const callUser = async (phone: string, task: string = "some task") => {
  console.log("calling user", phone);
  const response = await client.calls.create({
    twiml:
      "<Response><Say>Hello your task with name " +
      task +
      " is due</Say></Response>",
    to: "+91" + phone,
    from: process.env.TWILIO_PHONE_NUMBER!,
    timeout: 30,
    statusCallbackEvent: ["answered", "completed"],
    statusCallbackMethod: "POST",
    statusCallback: `${process.env.BASE_URL}/api/callback`,
  });

};
