import { db, auth } from "../../utils/firebase/firebaseAdmin";

const userInfo = async (req, res) => {
    if (!req.body || !req.body.id) {
        res.status(400).send("missing-argument");
        return;
      }
    
    const id = req.body.id;
    const uid = req.body.uid;
    
    var taken = false;
    console.log(id)
    await db.ref("Users").once("value").then(async function(questionsSnapshot) {
        var value;
        await questionsSnapshot.forEach(function(questionSnapshot) {
          value = questionSnapshot.child("name").val();
        
          if (id == value) {
            taken = true;
            const rating = questionSnapshot.child("rating").val();
            const contests = questionSnapshot.child("contests").val();
            const rank = questionSnapshot.child("rank").val();

            var you = (uid === questionSnapshot.key)
            console.log(you)
            res.status(200).send({rating: rating, contests: contests, rank: rank, you: you})
          }
        });
      });
    

    if (!taken) {
        res.status(400).send("Not Found")
    }
};

export default userInfo;


