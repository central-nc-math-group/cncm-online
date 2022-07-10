import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";
import { Auth } from "../../utils/types";
import { useAuth } from "../../utils/firebase/auth";

const leaderboard = async (req, res) => {
    if (!req.body || !req.body.id) {
        res.status(400).send("missing-argument");
        return;
    }

    var round = 3;
    var scorersTable = [];
    await db.ref("Competitors/Round" + round).once("value").then(function(questionsSnapshot) {
        var userId;
    
        questionsSnapshot.forEach(function(questionSnapshot) {
        userId = questionSnapshot.key;
        var name = questionSnapshot.child("name").val();

        var score = [0,0,0,0,0,0,0]
        var userscore = 0;
        
        if (name != null) {
            //placehold is 1 to avoid divide by 0
            for (let n = 1; n < 8; n++) {
            score[n-1] = questionSnapshot.child("q" + n.toString() + "/Score").val();

            if (score[n-1] == null) {
                score[n-1] = 0
            }

            userscore += score[n-1]
            }

            db.ref("Competitors/Round"+round+"/"+userId).update({totalscore: userscore});
            scorersTable.push([name, userscore, score[0], score[1], score[2], score[3], score[4], score[5], score[6]]);
        }
        });
    });
    
    scorersTable.sort((a,b) => (a[1] < b[1]) ? 1 : -1);

    // Rank storage for a later time
    // if (distance >= 0) {
    //   firebase.database().ref("Competitors/" + round + "/" + scorersTable[i-1].userid + "/rank").update({[time]: i});
    // } else {
    //   firebase.database().ref("Competitors/" + round + "/" + scorersTable[i-1].userid + "/rank").update({"Final": i});
    // }
    // firebase.database().ref("Competitors/" + round + "/" + scorersTable[i-1].userid + "/rank").update({"Current": i});


    res.status(201).send(scorersTable)

};

export default leaderboard;

