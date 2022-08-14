import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";
import { Auth } from "../../utils/types";
import { useAuth } from "../../utils/firebase/auth";

const userboard = async (req, res) => {
    if (!req.body || !req.body.uid) {
        res.status(400).send("missing-argument");
        return;
    }

    var uid = req.body.uid;
    var round = 7;
    var scorersTable = [];
    await db.ref("Competitors/Round" + round+"/"+uid).once("value").then(function(questionSnapshot) {

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

            db.ref("Competitors/Round"+round+"/"+uid).update({totalscore: userscore});
            var rank = questionSnapshot.child("rank/Current").val();

            scorersTable.push([rank, name, userscore, score[0], score[1], score[2], score[3], score[4], score[5], score[6]]);
        }
    });



    res.status(201).send(scorersTable);

};

export default userboard;

