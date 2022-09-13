import { query as q } from 'faunadb';

import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const { email } = user;

      try {
        await fauna.query(
          q.If( // If de validação para ver se o usuario ja existe
            q.Not(
              q.Exists(
                q.Match( // Faz um match com o email
                  q.Index('user_by_email'), // Atraves desse index: user_by_email
                  q.Casefold(user.email) // casefold para fazer um lowercase no email
                )
              )
            ),
            q.Create( // Se não existir ele cria o email
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get( // Se existir ele faz um get no email
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )

        return true
      } catch {
        return false
      }
    }
  }
})