import { FormMessage, Message } from "@/components/form-message"
import { SignupForm } from "@/components/signup-form"

export default async function LoginPage(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
      <div className="flex flex-col items-center justify-center p-1 md:p-10 bg-[#0f2137]">
      <div className="w-full max-w-lg md:max-w-6xl">
        <SignupForm searchParams={searchParams} />
      </div>
    </div>
    
  )
}

