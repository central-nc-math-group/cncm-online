import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../utils/redis";
import { auth } from "../../../utils/firebaseAdmin";
import { sendEmailVerification } from "../../../utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).send("missing-argument");
    return;
  }
  if (!req.body.username) {
    res.status(400).send("auth/no-empty-username");
    return;
  }
  
  const { email, username, password } = req.body;
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    res.status(400).send("auth/incorrect-username-syntax");
    return;
  }
  if (username.length > 40) {
    res.status(400).send("auth/username-too-long");
    return;
  }
  if (email.length > 60) {
    res.status(400).send("auth/email-too-long");
    return;
  }
  if (password.length < 8) {
    res.status(400).send("auth/password-too-short");
    return;
  }
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*{}"'`/,._[\]~\-+])[a-zA-Z\d\w\W]{8,}$/.test(
      password
    )
  ) {
    res.status(400).send("auth/incorrect-password-format");
    return;
  }

  const usernameExists = await redis.exists(`username:${username}`);
  if (usernameExists === 1) {
    res.status(400).send("auth/username-already-exists");
    return;
  }

  auth
    .createUser({
      email,
      password,
      displayName: username,
    })
    .then(async (userRecord) => {
      await redis.hmset(
        `user:${userRecord.uid}`,
        "username",
        username,
        "email",
        email,
        "rating",
        0
      );
      await redis.hset(`username:${username}`, "email", email);
      sendEmailVerification(userRecord.uid, email, username, req)
        .then(() => {
          res.status(201).send("Account Created");
          return;
        })
        .catch((error) => {
          console.log(error);
          res.status(400).send(error);
          return;
        });
    })
    .catch((error) => {
      res.status(400).send(error.code);
      return;
    });
};
