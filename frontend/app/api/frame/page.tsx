import { NextApiRequest, NextApiResponse } from "next";

export default function Page(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "Hello world" });
}
