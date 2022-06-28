import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";

const getProblem = async (req, res) => {
  if (!req.body || !req.body.id) {
    res.status(400).send("missing-argument");
    return;
  }

  const id = req.body.id

  const response = await fetch("http://worldtimeapi.org/api/timezone/America/New_York");
  const jsonData = await response.json();
  const timeString = jsonData.datetime.substring(0,19) + "-04:00"


  const contestInfo = await fetch("http://localhost:3000/api/contestInfo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({test:1}),
  });
  const contestJSON = await contestInfo.json()


  let difference = +new Date(timeString) - +new Date(contestJSON.startTime);


  const prompt = await db
    .ref("/BackgroundProcess/" + id + "/prompt")
    .once("value")
    .then((snapshot) => (snapshot.val()));

  if (difference < 0) {
    res.status(403).send("Forbidden");
  } else {
    res.status(200).send(prompt);
  }

};

export default getProblem;