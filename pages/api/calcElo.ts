import { db, auth } from "../../utils/firebase/firebaseAdmin";

const calcElo = async (req, res) => {
    if (!req.body || !req.body.id) {
        res.status(400).send("missing-argument");
        return;
    }

    // Reset rating
    await db.ref("Users").once("value").then(function(questionsSnapshot) {
        questionsSnapshot.forEach(function(questionSnapshot) {
            db.ref(`Users/${questionSnapshot.key}/rating`).set(1200);
            db.ref(`Users/${questionSnapshot.key}/contests`).set(0);
            db.ref(`Users/${questionSnapshot.key}/rank`).set(0);
        });
      });

    // Loop by round

    var K = 20;
    var alpha = 1.5;

    for (var f = 1; f <= 4; f++) {
        var ratings = [];
        var totalScore = 0;
        await db.ref("Competitors/Round" + f).once("value").then(function(questionsSnapshot) {

            questionsSnapshot.forEach(function(superSnapshot) {

                var score = superSnapshot.child("totalscore").val()
                var rank = superSnapshot.child("rank/Final").val()
                if (score < 0) {
                    score = 0;
                }
                ratings.push({id: superSnapshot.key, score: score, rank: rank});
                totalScore += score;
            });
        });

        for (var i = 0; i < ratings.length; i++) {
            const rating = await db
            .ref(`Users/${ratings[i].id}/rating`)
            .once("value")
            .then((snapshot) => snapshot.val());
            const contests = await db
            .ref(`Users/${ratings[i].id}/contests`)
            .once("value")
            .then((snapshot) => snapshot.val());
            ratings[i].rating = rating;
            ratings[i].contests = contests + 1;
        }
        for (var i = 0; i < ratings.length; i++) {
            var ea = 0.0;
            for (var j = 0; j < ratings.length; j++) {
                if (i != j) {
                    ea += (1.0 / (1 + Math.pow(10.0, ((ratings[j].rating - ratings[i].rating)/400))))
                }
            }
            ea = ea / (1.0 * ratings.length * (ratings.length - 1) * 0.5)
            ratings[i].ea = ea;
            var sval = 0;

            // for (var m = 1; m <= ratings.length; m++) {
            //     sval += (Math.pow(alpha, ratings.length - m) - 1);
            // }

            // sval = (1.0 * ratings.length - 1.0 * ratings[i].rank)/(0.5 * ratings.length * (ratings.length - 1))
            // ratings[i].s = sval;

            ratings[i].s = (1.0 * ratings[i].score)/(1.0 * totalScore)

            console.log(ratings[i].s)
            var newRating = Math.floor(ratings[i].rating + K * (ratings.length - 1) * (ratings[i].s - ratings[i].ea));
            await db.ref(`Users/${ratings[i].id}/rating`).set(newRating);
            await db.ref(`Users/${ratings[i].id}/contests`).set(ratings[i].contests);
        }

    }

    var topRated = [];
    await db.ref("Users").once("value").then(function(questionsSnapshot) {
        questionsSnapshot.forEach(function(superSnapshot) {
          var name = superSnapshot.child("name").val();
          var rating = superSnapshot.child("rating").val();
          topRated.push({id: superSnapshot.key, name: name, rating: rating});
        });
      });
    topRated.sort((a,b) => (a.rating < b.rating) ? 1 : -1);

    for (var i = 0; i < topRated.length; i++) {
        await db.ref(`Users/${topRated[i].id}/rank`).set(i+1);
    }


    res.status(200).send("Success");
};

export default calcElo;