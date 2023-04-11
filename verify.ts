import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  if (!token || Array.isArray(token)) {
    res.status(400).json({ message: 'Invalid token' });
    return;
  }

  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection('users').findOne({ verificationToken: token });

  if (!user) {
    res.status(404).json({ message: 'Token not found' });
    return;
  }

  // Set user as verified and remove the verificationToken
  await db.collection('users').updateOne(
    { _id: user._id },
    {
      $set: { verified: true },
      $unset: { verificationToken: "" },
    }
  );

  res.status(200).json({ message: 'User verified' });
}
