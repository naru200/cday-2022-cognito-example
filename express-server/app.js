import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import jwt from "express-jwt";
import jwks from "jwks-rsa";
import AWS from "aws-sdk";

import * as dotenv from "dotenv";
dotenv.config();

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.COGNITO_REGION,
});

const app = express();

app.use(cors());

app.use(
  jwt.expressjwt({
    secret: jwks.expressJwtSecret({
      jwksUri: process.env.COGNITO_JWKS_URI,
    }),
    audience: process.env.BASE_URL,
    issuer: process.env.COGNITO_ISSUER,
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

app.get("/give-me-a-cat", async (req, res, next) => {
  try {
    const cats = await fetch("https://api.thecatapi.com/v1/images/search", {
      headers: { "x-api-key": process.env.CAT_API_KEY },
    }).then((res) => res.json());

    res.status(200).json({ image: cats[0].url });
  } catch (error) {
    next(error);
  }
});

app.listen(3000, () => {
  console.log(`Example app started on port 3000!`);
});
