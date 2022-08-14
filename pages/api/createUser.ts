import { db, auth } from "../../utils/firebase/firebaseAdmin";

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

  await db.ref("Users").once("value").then(async function(questionsSnapshot) {
    var value;
    var value2;
    await questionsSnapshot.forEach(function(questionSnapshot) {
      value = questionSnapshot.child("name").val();
      value2 = questionSnapshot.child("email").val();
      
      if (displayName == value) {
        res.status(400).send("auth/username-already-exists");
      }

      if (email == value2) {
        res.status(400).send("auth/email-already-exists");
      }

    });
  });

  auth
    .createUser({
      email,
      displayName,
      password,
    })
    .then(async (userRecord) => {
      await db.ref(`/Users/${userRecord.uid}`).set({
        username: displayName,
        email: userRecord.email,
        rating: 1200,
      });
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