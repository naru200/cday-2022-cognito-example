import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import jwt from "express-jwt";
import jwks from "jwks-rsa";
import AWS from "aws-sdk";

import * as dotenv from "dotenv";
dotenv.config();

const COGNITO_ISSUER = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`;
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.COGNITO_REGION,
});

const app = express();

app.use(cors());

app.get("/", (req, res) => res.status(200).send("OK"));

app.use(
  jwt.expressjwt({
    secret: jwks.expressJwtSecret({
      jwksUri: `${COGNITO_ISSUER}/.well-known/jwks.json`,
    }),
    issuer: COGNITO_ISSUER,
    algorithms: ["RS256"],
  })
);

app.post("/grant-access", (req, res) => {
  cognito.adminAddUserToGroup(
    {
      GroupName: "audience",
      Username: req.auth.username,
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
    },
    (err, _) => {
      if (err) res.status(500).json({ message: err.message });
      else {
        res.status(200).json({ message: "Permission granted!" });
      }
    }
  );
});

app.get("/cat", (req, res) => {
  if (!req.auth["cognito:groups"]?.includes("audience")) {
    res
      .status(403)
      .json({ message: "You are not authorized to perform this operation." });
  }

  fetch("https://api.thecatapi.com/v1/images/search", {
    headers: { "x-api-key": process.env.CAT_API_KEY },
  }).then(async (catResponse) => {
    if (catResponse.ok) {
      const cats = catResponse.json();
      res.status(200).json({ image: cats[0].url });
    }
  });
});

app.use((err, req, res, _) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Invalid token" });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log(`Example app started on port 3000!`);
});
