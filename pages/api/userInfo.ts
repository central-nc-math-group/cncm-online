import clientPromise from "../../utils/mongo/index";

const userInfo = async (req, res) => {
    if (!req.body || !req.body.id) {
        res.status(400).send("missing-argument");
        return;
      }
    
    const id = req.body.id;
    const uid = req.body.uid;
    
    var taken = false;


    try {
      const client = await clientPromise;
      const db = client.db("Users");

      const movies = await db
          .collection("Accounts")
          .find({name: id})
          .limit(1)
          .toArray();

      res.json(movies);
  } catch (e) {
      console.error(e);
  }
};

export default userInfo;



