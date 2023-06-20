import image from "next/image";
import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";
import clientPromise from "../../utils/mongo/index";

const getProblem = async (req, res) => {
  if (!req.body || !req.body.id || !req.body.token) {
    res.status(400).send("missing-argument");
    return;
  }

  // console.log(new Date().toISOString());

  const {
    id,
    token
  } = req.body;

  const decode = await auth.verifyIdToken(token);

  // the user is authenticated!
  const { uid, email } = decode;

  const response = await fetch("http://worldtimeapi.org/api/timezone/America/New_York");
  const jsonData = await response.json();
  const timeString = jsonData.datetime.substring(0,19) + "-04:00"

  const client = await clientPromise;
  const db = client.db("Active");
  const db2 = client.db("Users");
  
  const contestData = await db
    .collection("Info")
    .find({})
    .limit(1)
    .toArray();

  let contestJSON = contestData[0];


  let difference = +new Date(timeString) - +new Date(contestJSON.startTime);
  let difference2 = +new Date(timeString) - +new Date(contestJSON.endTime);


  const problem = await db
    .collection("Problems")
    .findOne({id: id})

  var solved = false;
  var attempts = 5;
  var score = 0;
  var img = false;

  if (problem.img != null) {
    img = true;
  }

  let reference = await db
    .collection("Scores")
    .findOne({id: uid})
  
  const user = await db2
    .collection("Accounts")
    .findOne({id: uid})
  
  if (!user) {
    res.status(400).send("Error");
  }

  if (reference == null) {
    
  } else {
      solved = reference.scoreData[id-1].solved;
      attempts = reference.scoreData[id-1].attempts;
      score = reference.scoreData[id-1].score;
  }

  // await db.ref("Competitors/Round" + contestJSON.round + "/" + uid + "/" + id).once("value").then(function(snapshot) {
  //     solved = snapshot.child("Solved").val()
  //     attempts = snapshot.child("Attempts").val()
  //     score = snapshot.child("Score").val()
  // })
  
  // if (attempts === null) { attempts = 5}
  // if (!score) {score = 0}
  // if (solved === null) { solved = false}

  if (difference < 0 || difference2 > 0) {
    res.status(403).send("Forbidden");
  } else {
    res.status(200).send({prompt: problem.prompt, solved: solved, attempts: attempts, score: score, img: img, imgPath: problem.img});
  }

};

export default getProblem;