import {
  PaymailRouter,
  PublicKeyInfrastructureRoute,
  PublicProfileRoute,
  RequestSenderValidationCapability,
} from "@bsv/paymail";

const pkiRoute = new PublicKeyInfrastructureRoute({
  domainLogicHandler: async (params) => {
    return {
      bsvalias: '1.0',
      handle: `sweep@sweep.xn--nda.network`,
      pubkey: '026a71b29fe6dddac386266be2c598739177d2a0f87c767f5db55e9d0bd54a1ac5'
    }
  }
})

const publicProfileRoute = new PublicProfileRoute({
  domainLogicHandler: async (params) => {
    return {
      name: 'Sweep',
      domain: 'sweep.xn--nda.network',
      avatar: 'https://thispersondoesnotexist.com'
    }
  }
})


const routes = [
  pkiRoute,
  publicProfileRoute,
];
const s = new PaymailRouter({
  baseUrl: "https://sweep.xn--nda.network",
  basePath: "/api/paymail",
  routes,
});

require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");

app.use(express.static("public"));
app.use(paymailRouter.getRouter());
