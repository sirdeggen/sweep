import {
  PaymailRouter,
  PublicKeyInfrastructureRoute,
  PublicProfileRoute,
  RequestSenderValidationCapability,
} from "@bsv/paymail";

const routes = [
  PublicKeyInfrastructureRoute,
  PublicProfileRoute,
  RequestSenderValidationCapability,
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
