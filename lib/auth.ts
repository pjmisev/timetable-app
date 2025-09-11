import NextAuth from "next-auth"
import authConfig from "../auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.savedDepartment = user.savedDepartment
        token.savedClass = user.savedClass
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      session.user.savedDepartment = token.savedDepartment
      session.user.savedClass = token.savedClass
      return session
    },
  },
  ...authConfig,
})