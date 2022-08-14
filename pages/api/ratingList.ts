import { db, auth } from "../../utils/firebase/firebaseAdmin";

const ratingList = async (req, res) => {
    if (!req.body || !req.body.id) {
        res.status(400).send("missing-argument");
        return;
    }

    var topRated = [];
    await db.ref("Users").once("value").then(function(questionsSnapshot) {
        questionsSnapshot.forEach(function(questionSnapshot) {
          var name = questionSnapshot.child("name").val();
          var rating = questionSnapshot.child("rating").val();
          topRated.push([name, rating]);
        });
      });
    topRated.sort((a,b) => (a[1] < b[1]) ? 1 : -1);

    const result = topRated.slice(0,10);
    

    res.status(201).send(result);
};

export default ratingList;


