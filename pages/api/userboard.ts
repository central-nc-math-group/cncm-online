import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";
import { Auth } from "../../utils/types";
import { useAuth } from "../../utils/firebase/auth";
import clientPromise from "../../utils/mongo";

let N = 25;

const userboard = async (req, res) => {
    if (!req.body || !req.body.uid) {
        res.status(400).send("missing-argument");
        return;
    }

    var uid = req.body.uid;

    const client = await clientPromise;
    const db = client.db("Active");
    const db2 = client.db("Users");

    let response = [];

    let scorersTable = await db
        .collection("Scores")
        .find()
        .sort({totalScore: -1})
        .toArray()

    for (var i = 0; i < scorersTable.length; i++) {
        if (scorersTable[i].id == uid) {
            let scoreRow = [i+1, scorersTable[i].name, scorersTable[i].totalScore];
            for (var j = 0; j <= N; j++) scoreRow.push(scorersTable[i].scoreData[j].score);
            response.push(scoreRow);
        }
    }

    let user = await db2
        .collection("Accounts")
        .findOne({id: uid})
    
    if (response.length == 0) {
        let blankRow = ['-', user.name, 0]
        for (var i = 0; i < N; i++) blankRow.push(0);
        response.push(blankRow);
    }





    res.status(201).send(response);

};

export default userboard;

