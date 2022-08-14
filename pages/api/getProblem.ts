import image from "next/image";
import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";

const getProblem = async (req, res) => {
  if (!req.body || !req.body.id || !req.body.uid) {
    res.status(400).send("missing-argument");
    return;
  }

  // console.log(new Date().toISOString());

  const {
    id,
    uid
  } = req.body;

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
  let difference2 = +new Date(timeString) - +new Date(contestJSON.endTime);


  const prompt = await db
    .ref("/BackgroundProcess/" + id + "/prompt")
    .once("value")
    .then((snapshot) => (snapshot.val()));
  
  const imgPath = await db
    .ref("/BackgroundProcess/" + id + "/img")
    .once("value")
    .then((snapshot) => (snapshot.val()));
// henloe bakshar
  var solved = false;
  var attempts = 5;
  var score = 0;
  var img = false;

  if (imgPath != null) {
    img = true;
  }
  // is there a more efficient way to do this

  await db.ref("Competitors/Round" + contestJSON.round + "/" + uid + "/" + id).once("value").then(function(snapshot) {
      solved = snapshot.child("Solved").val()
      attempts = snapshot.child("Attempts").val()
      score = snapshot.child("Score").val()
  })
  
  if (attempts === null) { attempts = 5}
  if (!score) {score = 0}
  if (solved === null) { solved = false}

  if (difference < 0 || difference2 > 0) {
    res.status(403).send("Forbidden");
  } else {
    res.status(200).send({prompt: prompt, solved: solved, attempts: attempts, score: score, img: img, imgPath: imgPath});
  }

};

export default getProblem;