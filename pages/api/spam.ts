import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // await redis.hmset
  const val = await redis.set(
    "SPAM CAM NEWTON",
    "AKSHAR IF YOU SEE THIS DM ME BARNAV ORZ"
  );
  res.status(200).json({ val });
};
