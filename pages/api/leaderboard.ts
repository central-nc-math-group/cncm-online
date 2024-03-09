import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";
import { Auth } from "../../utils/types";
import { useAuth } from "../../utils/firebase/auth";

const leaderboard = async (req, res) => {
    if (!req.body || !req.body.id) {
        res.status(400).send("missing-argument");
        return;
    }

    var round = 8;
    var N = 25;
    var scorersTable = [];
    var superTable = [];
    await db.ref("Competitors/Round" + round).once("value").then(function(questionsSnapshot) {
        var userId;
    
        questionsSnapshot.forEach(function(questionSnapshot) {
        userId = questionSnapshot.key;
        var name = questionSnapshot.child("name").val();

        var score = []
        for (var i = 0; i < N; i++) score.push(0);
        var userscore = 0;
        
        if (name != null) {
            //placehold is 1 to avoid divide by 0
            for (let n = 1; n <= N; n++) {
                score[n-1] = questionSnapshot.child("q" + n.toString() + "/Score").val();

                if (score[n-1] == null) {
                    score[n-1] = 0
                }

                userscore += score[n-1]
            }

            db.ref("Competitors/Round"+round+"/"+userId).update({totalscore: userscore});
            let updateRow = [name, userscore]
            for (var i = 0; i < N; i++) updateRow.push(score[i]);
            scorersTable.push(updateRow);
            superTable.push([userId, userscore])
        }
        });
    });
    
    scorersTable.sort((a,b) => (a[1] < b[1]) ? 1 : -1);
    superTable.sort((a,b) => (a[0] < b[0]) ? 1 : -1);

    // Rank storage for a later time


    // if (distance >= 0) {
    //   firebase.database().ref("Competitors/" + round + "/" + scorersTable[i-1].userid + "/rank").update({[time]: i});
    // } else {
    //   firebase.database().ref("Competitors/" + round + "/" + scorersTable[i-1].userid + "/rank").update({"Final": i});
    // }

    for (var i = 1; i <= superTable.length; i++) {
        db.ref("Competitors/" + "Round" + round + "/" + scorersTable[i-1][0] + "/rank").update({"Current": i});
    }



    res.status(201).send(scorersTable)

};

export default leaderboard;

