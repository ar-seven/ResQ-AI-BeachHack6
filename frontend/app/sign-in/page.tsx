import { Message,FormMessage } from "@/components/form-message"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <LoginForm searchParams={searchParams} />
      </div>
    </div>
  )
}

