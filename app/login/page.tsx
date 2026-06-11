"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { siteConfig } from "@/config/site"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LanguageSelector } from "@/components/shared/language-selector"
import { AuthHero } from "@/components/auth/auth-hero"

const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Please enter your username or email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean(),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  })

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  function onSubmit(values: LoginValues) {
    setIsSubmitting(true)
    setErrorMsg(null)

    // We use next-auth's signIn dynamically to avoid importing it at the top
    // which can sometimes cause issues in app router if not configured perfectly
    import("next-auth/react").then(({ signIn }) => {
      signIn("user-login", {
        redirect: false,
        email: values.identifier,
        password: values.password,
      })
        .then((res) => {
          setIsSubmitting(false)
          if (res?.error) {
            toast.error("Invalid credentials. Please try again.")
            setErrorMsg("Invalid credentials. Please try again.")
          } else {
            toast.success("Login successful")
            router.push("/dashboard")
            router.refresh()
          }
        })
        .catch(() => {
          setIsSubmitting(false)
          toast.error("Something went wrong.")
          setErrorMsg("Something went wrong.")
        })
    })
  }

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-x-hidden bg-background font-sans text-foreground md:grid-cols-2">
      <AuthHero />

      {/* Right Column: Form Pane */}
      <div className="relative flex min-h-screen flex-col justify-between bg-background p-6 md:p-12">
        {/* Top bar */}
        <div className="relative z-10 mb-8 flex w-full items-center justify-end gap-4">
          <Link
            href="/register"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("auth.login.registerLink")}
          </Link>

          {/* Language Selector */}
          <LanguageSelector />
        </div>

        {/* Form Container */}
        <div className="mx-auto my-auto w-full max-w-md py-4">
          <div className="mb-8 text-center md:text-left">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              {t("auth.login.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("auth.login.subtitle")}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <p className="text-center text-sm font-medium text-red-500">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Username or Email */}
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t("auth.login.identifier")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("auth.login.identifier")}
                        className="h-11 rounded-lg border-border bg-muted/40 px-3.5 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-foreground/80">
                        {t("auth.login.password")}
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-secondary hover:underline"
                      >
                        {t("auth.login.forgotPassword")}
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("auth.login.password")}
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

              {/* Remember Me */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-y-0 space-x-3 rounded-md py-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer text-xs font-normal text-muted-foreground">
                      {t("auth.login.rememberMe")}
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("auth.login.submitting")}
                  </>
                ) : (
                  t("auth.login.submit")
                )}
              </Button>
            </form>
          </Form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              {t("auth.login.noAccount")}{" "}
              <Link
                href="/register"
                className="font-semibold text-secondary hover:underline"
              >
                {t("auth.login.registerLink")}
              </Link>
            </p>
          </div>
        </div>

        {/* Mobile footer */}
        <div className="mt-8 border-t border-border pt-4 text-center text-[10px] text-muted-foreground md:hidden">
          © {new Date().getFullYear()} {siteConfig.name}.{" "}
          {t("auth.allRightsReserved")}
        </div>
      </div>
    </div>
  )
}
