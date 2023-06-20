import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { post } from "../../utils/restClient";
import { Auth } from "../../utils/types";
import { useAuth } from "../../utils/firebase/auth";
import clientPromise from "../../utils/mongo";

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
            response.push([i+1, scorersTable[i].name, scorersTable[i].totalScore, scorersTable[i].scoreData[0].score, scorersTable[i].scoreData[1].score, scorersTable[i].scoreData[2].score, scorersTable[i].scoreData[3].score, scorersTable[i].scoreData[4].score, scorersTable[i].scoreData[5].score, scorersTable[i].scoreData[6].score]);
        }
    }

    let user = await db2
        .collection("Accounts")
        .findOne({id: uid})
    
    if (response.length == 0) {
        response.push(['-', user.name, 0, 0, 0, 0, 0, 0, 0, 0])
    }





    res.status(201).send(response);

};

export default userboard;

