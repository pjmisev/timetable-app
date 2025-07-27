import Google from "next-auth/providers/google"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Google, MicrosoftEntraID, GitHub],
} satisfies NextAuthConfig