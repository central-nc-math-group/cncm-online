import { db, auth } from "../../utils/firebase/firebaseAdmin";

const contestInfo = async (req, res) => {

  const num = await db
    .ref("/Contest/problems")
    .once("value")
    .then((snapshot) => (snapshot.val()));

    const startTime = await db
    .ref("/Contest/startTime")
    .once("value")
    .then((snapshot) => (snapshot.val()));

    res.status(200).send({num: num, startTime: startTime});
};

export default contestInfo;