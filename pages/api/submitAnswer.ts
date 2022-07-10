import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";
import { Auth } from "../../utils/types";
import { useAuth } from "../../utils/firebase/auth";

const submitAnswer = async (req, res) => {
    if (!req.body || !req.body.id || !req.body.answer || !req.body.uid) {
        res.status(400).send("missing-argument");
        return;
    }

    const {
        id,
        answer,
        uid
      } = req.body;
    
    var duration = 1
    var penalty = 1
    var round = 1
    var pointvalues = []
    var startTime = ""
    var endTime = ""
    
    await db.ref("Contest").once("value").then(function(snapshot) {
      duration = snapshot.child("duration").val()
      penalty = snapshot.child("penalty").val()
      pointvalues = snapshot.child("pointValues").val()
      round = snapshot.child("round").val()
      startTime = snapshot.child("startTime").val()
      endTime = snapshot.child("endTime").val()
    })

    const response = await fetch("http://worldtimeapi.org/api/timezone/America/New_York");
    const jsonData = await response.json();
    const timeString = jsonData.datetime.substring(0,19) + "-04:00"

    var distance = +new Date(timeString) - +new Date(startTime);
    var distance2 = +new Date(timeString) - +new Date(endTime);


    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var scoreTime = 60 * hours + minutes + 1;
    

    
    var qnumber = parseInt(id.replace("q",""));

    var reference = db.ref("Competitors/"+"Round" + round+"/"+uid)
    
//     var answer = 0;
    
//     await firebase.database().ref("Answers").once("value").then(function(snapshot) {
//         answer = snapshot.child(question).val();
//     });
    
    var solved;
    await reference.child(id + "/Solved").once("value").then(function(snapshot) {
        solved = snapshot.val()
    });
    
    var totalscore = 0;
    await reference.child("totalscore").once("value").then(function(snapshot) {
        totalscore = snapshot.val();
    });
    
    if (!solved || (distance > 0 && distance2 < 0)) {
      reference.child(id + "/Attempts").once("value").then(async function(snapshot) {
        let attempts = snapshot.val()

        //null means there are 5 attempts
        if (attempts == null) { 
          attempts = 5
        }
        attempts -= 1

        let questionreference = reference.child(id)

        questionreference.child("Answers").update({[(4 - attempts).toString()]: answer})
        questionreference.child("AnswerTimes").update({[(4 - attempts).toString()]: scoreTime})
        
        var correctAnswer = 0
        await db.ref("BackgroundProcess/" + id + "").once("value").then(function(snapshot) {
            correctAnswer = snapshot.child("answer").val()
        })

          
          if (attempts >= 0) {
            // STORE LAST ANSWER
            // document.getElementById(question).value = ""
            // document.getElementById(question).placeholder = "Current Answer: " + x
            var displayName2 = ""
            var email2 = ""

            await db.ref("Users/" + uid).once("value").then(function(snapshot) {
                displayName2 = snapshot.child("name").val()
                email2 = snapshot.child("email").val()
            })
            // FIX THIS
            reference.update({name: displayName2, email: email2});

            //
            questionreference.update({Time: scoreTime, Submission: answer});
            console.log(answer +  " " + correctAnswer)
            if (answer == correctAnswer) {

              var newscore = Math.floor(pointvalues[qnumber - 1] * (0.5 + 0.5 * ((duration - scoreTime) / duration)) - penalty * (4 - attempts))
              questionreference.update({Score: newscore})

              var changescore = Math.floor(pointvalues[qnumber - 1] * (0.5 + 0.5 * ((duration - scoreTime) / duration)))

              totalscore += changescore;

              reference.update({totalscore: totalscore});

              questionreference.update({Solved: true});
              res.status(200).send("Correct")
            } else {
              var newscore = -1 * penalty * (5 - attempts)
              questionreference.update({Score: newscore})

              totalscore -= penalty;

              reference.update({totalscore: totalscore});
                res.status(200).send("Incorrect")
            }

            if (attempts >= 0) {
                questionreference.update({Attempts: attempts})
            }
          } else {
            res.status(200).send("No Attempts")
          }

        })
    } else {
        res.status(400).send("Error")
    }



};

export default submitAnswer;