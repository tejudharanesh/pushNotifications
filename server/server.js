const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// DO NOT USE IN PROD
const publicKey =
  "BDpN1b0pwhKIKo7GIr_NMgeugUBfthmtuY_B-Z2NyBc2SlX25ziqGvu-COTn_FhSJQoFxgY7F3-kfjMQZQVSsvA";
const privateKey = "0qish-rDfXIDHhH8qmfZN6xzfwOFsphgLzk9tW4ypew";
webPush.setVapidDetails("mailto:example@yourdomain.org", publicKey, privateKey);

const subscriptions = {};

app.post("/subscribe", (req, res) => {
  const { subscription, id } = req.body;
  subscriptions[id] = subscription;
  return res.status(201).json({ data: { success: true } });
});

app.post("/send", (req, res) => {
  const { message, title, id } = req.body;
  const subscription = subscriptions[id];
  const payload = JSON.stringify({ title, message });
  webPush
    .sendNotification(subscription, payload)
    .catch((error) => {
      return res.status(400).json({ data: { success: false } });
    })
    .then((value) => {
      return res.status(201).json({ data: { success: true } });
    });
});

app.get("/info", (req, res) => {
  return res.status(200).json({ data: JSON.stringify(subscriptions) });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
