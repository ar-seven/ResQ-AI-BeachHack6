import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FormMessage, Message } from "@/components/form-message";
import {signUpAction} from "@/app/actions"
import { SubmitButton } from "./submit-button"
export function SignupForm({ className, searchParams, ...props }: React.ComponentProps<"div"> & { searchParams?: Message }) {
    const search1Params = searchParams;
  return (
    <div className={cn("flex flex-col gap-1")} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-balance text-red-600">
                  Sign up for ResQ  AI
                </p>
              </div>

              {/* Personal Information */}
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input name="name" id="name" type="text" placeholder="John Doe" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Contact Phone</Label>
                <Input name="phone" id="phone" type="tel" placeholder="+91 98765 43210" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" id="email" type="email" placeholder="you@example.com" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input name="password" id="password" type="password" required />
              </div>

              {/* Health Information */}
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input name= "age" id="age" type="number" min="0" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="allergies">Medical Allergies</Label>
                <Textarea name="allergies" id="allergies" placeholder="List any allergies you have" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea name="medicalHistory" id="medicalHistory" placeholder="E.g., Diabetes, Hypertension, etc." />
              </div>

              {/* Emergency Contact */}
              <div className="grid gap-2">
                <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                <Input name="emergencyName" id="emergency-name" type="text" placeholder="Jane Doe" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select name="relationship">
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input name="emergencyPhone" id="emergencyPhone" type="tel" placeholder="+91 98765 43210" required />
              </div>

              <SubmitButton type="submit" className="w-full"  formAction={signUpAction}>
                Sign Up
              </SubmitButton>

              {searchParams && <FormMessage message={searchParams} />}

              

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/sign-in/" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>

          {/* Right Side - Images */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://www.phila.gov/media/20210121100428/Carlie-700x400.jpg"
              alt="Sign Up Illustration 1"
              className="absolute inset-0 h-1/3 w-full object-cover"
            />
            <img
              src="https://c1.wallpaperflare.com/preview/401/315/774/accident-action-adult-blaze.jpg"
              alt="Sign Up Illustration 2"
              className="absolute inset-0 top-1/3 h-1/3 w-full object-cover"
            />
            <img
              src="https://i.ytimg.com/vi/CgOen5VMBQA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLChv_RHfCdoG04SAOrTRVFgs0nWHQ"
              alt="Sign Up Illustration 3"
              className="absolute inset-0 top-2/3 h-1/3 w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
