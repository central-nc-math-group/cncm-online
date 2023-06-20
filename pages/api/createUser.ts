import { auth } from "../../utils/firebase/firebaseAdmin";
import clientPromise from "../../utils/mongo";

const createUser = async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).send("missing-argument");
    return;
  }
  if (!req.body.username) {
    res.status(400).send("auth/no-empty-username");
    return;
  }
  const {
    email,
    username: displayName,
    password,
  } = req.body;

  if (!/^[A-Za-z0-9\_]+$/.test(displayName)) {
    res.status(400).send("auth/incorrect-username-syntax");
    return;
  }
  if (displayName.length > 40) {
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

  const client = await clientPromise;
  const db = client.db("Users");

  let usernameQuery = await db
    .collection("Accounts")
    .findOne({name: displayName})

  let emailQuery = await db
    .collection("Accounts")
    .findOne({email: email})

  if (usernameQuery != null) {
    res.status(400).send("auth/username-already-exists");
    return;
  }

  if (emailQuery != null) {
    res.status(400).send("auth/email-already-exists");
    return;
  }


  auth
    .createUser({
      email,
      displayName,
      password,
    })
    .then(async (userRecord) => {


      let addAcount = db
        .collection("Accounts")
        .insertOne({id: userRecord.uid, name: displayName, email: userRecord.email, rating:1200})
      // await db.ref(`/usernames/${displayName}`).set({
      //   uid: userRecord.uid,
      //   email: userRecord.email,
      // });
      // sendEmailVerification(userRecord.uid, email, displayName, req)
      //   .then(() => {
      //     res.status(201).send("Account Created");
      //     return;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     res.status(400).send(error);
      //     return;
      //   });
      res.status(201).send("Account Created");
      return;
    })
    .catch((error) => {
      res.status(400).send(error.code);
      console.log(error.code);
      console.log(error);
    });

};

export default createUser;