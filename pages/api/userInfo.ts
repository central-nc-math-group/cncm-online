import { db, auth } from "../../utils/firebase/firebaseAdmin";

const userInfo = async (req, res) => {
    if (!req.body || !req.body.id) {
        res.status(400).send("missing-argument");
        return;
      }
    
    const id = req.body.id;
    
    var taken = false;
    console.log(id)
    await db.ref("Users").once("value").then(async function(questionsSnapshot) {
        var value;
        await questionsSnapshot.forEach(function(questionSnapshot) {
          value = questionSnapshot.child("name").val();
        
          if (id == value) {
            taken = true;
            const rating = questionSnapshot.child("rating").val();
            res.status(200).send({rating: rating})
          }
        });
      });
    

    if (!taken) {
        res.status(400).send("Not Found")
    }
};

export default userInfo;


