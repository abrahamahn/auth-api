// pages/api/checkUser.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './lib/mongodb';

export default async function checkUser(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection('users').findOne({ email });

  if (user) {
    res.status(200).json({ exists: true, user: { name: user.name, email: user.email, image: user.image } });
  } else {
    res.status(200).json({ exists: false });
  }
}
