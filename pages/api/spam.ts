import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // await redis.hmset
  const val = await redis.hget(
    "user:RFKWjQRnoCZKm6ey0hOvkfmNwTI3",
    "email"
  );
  res.status(200).json({ val });
};
