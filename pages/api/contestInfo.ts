import { db, auth } from "../../utils/firebase/firebaseAdmin";

const contestInfo = async (req, res) => {

    var num = 0;
    var round = 0;
    var startTime = "";
    var endTime = "";

    await db.ref("Contest").once("value").then(function(snapshot) {
        num = snapshot.child("problems").val()
        startTime = snapshot.child("startTime").val()
        round = snapshot.child("round").val()
        endTime = snapshot.child("endTime").val()
    })

    res.status(200).send({num: num, startTime: startTime, endTime: endTime, round: round});
};

export default contestInfo;