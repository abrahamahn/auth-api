import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";
import { sendverificationRequest } from "./lib/email";

export default NextAuth({
  session: {
    strategy: 'jwt'
  },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const emailOptions = {
          to: identifier,
          subject: 'Email Verification for Signup',
          html: `<p>Please click the link below to verify your email and continue the sign-up process:</p><a href="${url}">${url}</a>`,
        };

        await sendEmail(emailOptions);
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection('users').findOne({
          email: credentials.email,
          password: credentials.password,
        });

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/accounts/signin',
    signOut: '/accounts/signout',
    signUp: '/accounts/signup',
    error: '/accounts/error',
    resetPassword: '/accounts/reset-password',
    callbackUrl: '/app',
  },
  secret: process.env.NEXTAUTH_SECRET,
})