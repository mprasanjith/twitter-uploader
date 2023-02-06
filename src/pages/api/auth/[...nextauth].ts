import NextAuth, { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

if (!process.env.TWITTER_KEY || !process.env.TWITTER_SECRET) {
  throw new Error("No Twitter keys provided.");
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,

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
        token.oauthToken = account.oauth_token;
        token.oauthTokenSecret = account.oauth_token_secret;
      }
      return token;
    },
    async session({ session, token, user }) {
      // @ts-ignore
      session.oauthToken = token.oauthToken;
      // @ts-ignore
      session.oauthTokenSecret = token.oauthTokenSecret;
      return session;
    },
  },
};

export default NextAuth(authOptions);
