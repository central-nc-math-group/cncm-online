import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";
import { Auth } from "../../utils/types";
import { useAuth } from "../../utils/firebase/auth";
import clientPromise from "../../utils/mongo/index";

const submitAnswer = async (req, res) => {
    if (!req.body || !req.body.id || !req.body.answer || !req.body.token) {
        res.status(400).send("missing-argument");
        return;
    }

    const response = await fetch("http://worldtimeapi.org/api/timezone/America/New_York");
    const jsonData = await response.json();
    const timeString = jsonData.datetime.substring(0,19) + "-04:00"

    const {
        id,
        answer,
        token
      } = req.body;

    const decode = await auth.verifyIdToken(token);

      // the user is authenticated!
    const { uid, email } = decode;
    const client = await clientPromise;
    const db = client.db("Active");
    const db2 = client.db("Users");

    const contest = await db
        .collection("Info")
        .findOne({})

    var distance = +new Date(timeString) - +new Date(contest.startTime);
    var distance2 = +new Date(timeString) - +new Date(contest.endTime);


    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var scoreTime = 60 * hours + minutes + 1;

    let reference = await db
      .collection("Scores")
      .findOne({id: uid})
    
  
    var solved = false;
    var totalscore = 0;

    const user = await db2
      .collection("Accounts")
      .findOne({id: uid})
    
    if (!user) {
      res.status(400).send("Error");
    }

    if (reference == null) {

      const response = await db
      .collection("Scores")
      .insertOne({id: uid, name: user.name, email: user.email, totalScore: 0})
  
      for (var i = 0; i < contest.problems; i++) {
        const response = await db
          .collection("Scores")
          .updateOne(
            {id: uid},
            { '$push' : {scoreData: 
              {id: (i+1), solved: false, answerTimes: [], answers: [], attempts: 5, score: 0}
          }}
        )
      }
    } else {
      solved = reference.scoreData[id-1].solved;
      totalscore = reference.totalScore;
    }

    reference = await db
      .collection("Scores")
      .findOne({id: uid})
      
    if (!solved && (distance > 0 && distance2 < 0)) {

        //null means there are 5 attempts
        var attempts = reference.scoreData[id-1].attempts;

        attempts -= 1

        var answers = reference.scoreData[id-1].answers;
        var answerTimes = reference.scoreData[id-1].answerTimes;

        answers.push(answer);
        answerTimes.push(scoreTime);

        const result = await db
          .collection("Scores")
          .updateOne({id: uid, 'scoreData.id': id}, {$set: {'scoreData.$.answers': answers, 'scoreData.$.answerTimes': answerTimes}})


        const question = await db
          .collection("Problems")
          .findOne({id: id})

          
          if (attempts >= 0) {
            // STORE LAST ANSWER
            // document.getElementById(question).value = ""
            // document.getElementById(question).placeholder = "Current Answer: " + x
            

            const result = await db
              .collection("Scores")
              .updateOne({id: uid, 'scoreData.id': id}, {$set: {'scoreData.$.time': scoreTime, 'scoreData.$.submission': answer}})

            if (answer == question.answer) {

              var newscore = Math.floor(question.points * (0.5 + 0.5 * ((contest.duration - scoreTime) / contest.duration)) - contest.penalty * (4 - attempts))

              var changescore = Math.floor(question.points * (0.5 + 0.5 * ((contest.duration - scoreTime) / contest.duration)))

              totalscore += changescore;

    
              const result = await db
                .collection("Scores")
                .updateOne({id: uid, 'scoreData.id': id}, {$set: {'scoreData.$.score': newscore, 'scoreData.$.solved': true, 'scoreData.$.attempts': attempts}})
              
              const result2 = await db
                .collection("Scores")
                .updateOne({id: uid}, {$set: {totalScore: totalscore}})


              res.status(200).send("Correct")
            } else {
              var newscore = -1 * contest.penalty * (5 - attempts)
              totalscore -= contest.penalty;

              const result = await db
                .collection("Scores")
                .updateOne({id: uid, 'scoreData.id': id}, {$set: {'scoreData.$.score': newscore, 'scoreData.$.attempts': attempts}})
              
                const result2 = await db
                .collection("Scores")
                .updateOne({id: uid}, {$set: {totalScore: totalscore}})

              res.status(200).send("Incorrect")
            }

          } else {
            res.status(200).send("No Attempts")
          }


    } else {
        res.status(400).send("Error")
    }



};

export default submitAnswer;