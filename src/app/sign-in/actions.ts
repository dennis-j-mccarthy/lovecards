"use server"

import { signIn } from "@/lib/auth"

// When used as form action={signInWithEmail.bind(null, callbackUrl)},
// Next.js appends FormData as the last argument.
export async function signInWithEmail(callbackUrl: string, formData: FormData) {
  const email = formData.get("email") as string
  await signIn("resend", { email, redirectTo: callbackUrl })
}
