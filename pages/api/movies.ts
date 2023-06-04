import clientPromise from "../../utils/mongo/index";

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("sample_guides");

       const movies = await db
           .collection("planets")
           .find({})
           .sort({ orderFromSun: 1 })
           .limit(10)
           .toArray();

       res.json(movies);
   } catch (e) {
       console.error(e);
   }
};