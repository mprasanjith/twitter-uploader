import NextAuth, { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

if (!process.env.TWITTER_KEY || !process.env.TWITTER_SECRET) {
    throw new Error("No Twitter keys provided.")
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_KEY,
      clientSecret: process.env.TWITTER_SECRET,
    }),
    // ...add more providers here
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {
      // @ts-ignore
      session.accessToken = token.accessToken
      return session
    }
  }
};

export default NextAuth(authOptions);
