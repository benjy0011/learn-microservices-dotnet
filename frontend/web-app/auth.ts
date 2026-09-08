import NextAuth, { Profile } from "next-auth"
import { OIDCConfig } from "next-auth/providers"
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    DuendeIDS6Provider({
      id: 'id-server',
      clientId: "nextApp", // match the id configured in Identity Svc
      clientSecret: "secret", // this file is server side code, its save
      issuer: process.env.ID_URL,
      authorization: {
        params: {
          scope: 'openid profile auctionApp'
        },
        // Public browser URL for the initial OIDC redirect. This is what the user hits on localhost.
        url: process.env.ID_URL + '/connect/authorize'
      },
      token: {
        // Docker internal address: the web app container cannot reach localhost of the host.
        url: `${process.env.ID_URL_INTERNAL}/connect/token`
      },
      userinfo: {
        // Must use the service name from inside Docker to fetch user claims.
        url: `${process.env.ID_URL_INTERNAL}/connect/token`
      },
      idToken: true
    } as OIDCConfig<Omit<Profile, 'username'>>),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Keep login redirects inside the app and prevent open redirect abuse.
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async authorized({ auth }) {
      return !!auth;
    },
    async jwt({token, profile, account}) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.username = profile.username;
      }
      return token;
    },
    async session ({session, token}) {
      if (token) {
        session.user.username = token.username;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
})