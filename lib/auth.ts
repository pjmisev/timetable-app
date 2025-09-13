import NextAuth, { DefaultSession } from "next-auth"
import authConfig from "../auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"


declare module "next-auth" {

  interface User {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    savedDepartment?: string | null
    savedClass?: string | null
  }
}


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
      session.user.id = typeof token.id === "string" ? token.id : ""
      session.user.savedDepartment = typeof token.savedDepartment === "string" ? token.savedDepartment : null
      session.user.savedClass = typeof token.savedClass === "string" ? token.savedClass : null
      return session
    },
  },
  ...authConfig,
})