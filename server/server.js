const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// DO NOT USE IN PROD
const publicKey =
  "BDwHGzhI5w6HTrLP6LRF48oEHxaXGkjPnfdjx8hQWV43PrsSNru7t6ucBn_lOG1J74ktXqQOfuUVF5rwJ2WoV5w";
const privateKey = "prT637bgA-IqC4IYA6OR0_fbZqFzSR1vabKwcm7ezQ0";
webPush.setVapidDetails(
  "mailto:tejudharanesh1234@gmail.com",
  publicKey,
  privateKey
);

const subscriptions = {};

app.post("/subscribe", (req, res) => {
  const { subscription, id } = req.body;
  subscriptions[id] = subscription;
  return res.status(201).json({ data: { success: true } });
});

app.post("/send", async (req, res) => {
  const { message, title, id } = req.body;

  if (!subscriptions[id]) {
    return res
      .status(404)
      .json({ data: { success: false, message: "Subscription not found" } });
  }

  const subscription = subscriptions[id];
  const payload = JSON.stringify({ title, message });

  try {
    await webPush.sendNotification(subscription, payload);
    return res.status(201).json({ data: { success: true } });
  } catch (error) {
    console.error("Notification error:", error);
    return res
      .status(400)
      .json({ data: { success: false, error: error.message } });
  }
});

app.get("/info", (req, res) => {
  return res.status(200).json({ data: JSON.stringify(subscriptions) });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
