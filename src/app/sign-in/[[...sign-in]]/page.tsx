import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white grid place-items-center px-6 py-16">
      <div className="text-center">
        <img src="/logo.png" alt="Love Cards" className="h-32 mx-auto mb-8" />
        <SignIn />
      </div>
    </div>
  )
}
