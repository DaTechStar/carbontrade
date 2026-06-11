"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signIn } from "next-auth/react"
import { AuthHero } from "@/components/auth/auth-hero"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid admin email" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await signIn("admin-login", {
        redirect: false,
        email: values.email,
        password: values.password,
      })

      if (res?.error) {
        const cleanError = res.error.replace("CredentialsSignin: ", "")
        toast.error(cleanError)
        setErrorMsg(cleanError)
      } else {
        toast.success("Admin access granted.")
        router.push("/admin")
        router.refresh()
      }
    } catch (err) {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-x-hidden bg-background font-sans text-foreground md:grid-cols-2">
      <AuthHero />

      {/* Right Column: Form Pane */}
      <div className="relative flex min-h-screen flex-col justify-between bg-background p-6 md:p-12">
        {/* Top bar */}
        <div className="relative z-10 mb-8 flex w-full items-center justify-end gap-4">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            Admin Portal
          </span>
        </div>

        {/* Form Container */}
        <div className="mx-auto my-auto w-full max-w-md py-4">
          <div className="mb-8 text-center md:text-left">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              Admin Login
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to manage the {siteConfig.name} platform.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                  <p className="text-center text-sm font-medium text-destructive">
                    {errorMsg}
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      Admin Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        className="h-11 rounded-lg border-border bg-muted/40 px-3.5 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          className="h-11 rounded-lg border-border bg-muted/40 pr-10 pl-3.5 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Mobile footer */}
        <div className="mt-8 border-t border-border pt-4 text-center text-[10px] text-muted-foreground md:hidden">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </div>
  )
}
