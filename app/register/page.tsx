"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Select, SelectOption } from "@/components/ui/select"
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

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username cannot exceed 20 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    country: z.string().min(1, { message: "Please select your country" }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterContent />
    </React.Suspense>
  )
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referredBy = searchParams.get("ref")

  const { language, setLanguage, t } = useLanguage()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [countries, setCountries] = React.useState<SelectOption[]>([])
  const [loadingCountries, setLoadingCountries] = React.useState(true)
  const [errorCountries, setErrorCountries] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      acceptTerms: false,
    },
  })

  React.useEffect(() => {
    async function fetchCountries() {
      try {
        setLoadingCountries(true)
        setErrorCountries(false)
        const res = await fetch(
          "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json"
        )
        if (!res.ok) throw new Error("Failed to load country list")
        const data = await res.json()
        const formatted: SelectOption[] = data
          .map((c: { name: string; emoji: string }) => ({
            value: c.name,
            label: c.name,
            flag: c.emoji || "",
          }))
          .sort((a: SelectOption, b: SelectOption) =>
            a.label.localeCompare(b.label)
          )
        setCountries(formatted)
      } catch (err) {
        console.error(err)
        setErrorCountries(true)
      } finally {
        setLoadingCountries(false)
      }
    }
    fetchCountries()
  }, [])

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  async function onSubmit(values: RegisterValues) {
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.username,
          email: values.email,
          password: values.password,
          country: values.country,
          referredBy: referredBy || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      toast.success("Registration successful! Redirecting to login...")
      router.push("/login")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
      setErrorMsg(err.message || "Something went wrong")
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
          <Link
            href="/login"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("auth.register.loginLink")}
          </Link>

          {/* Language Selector */}
          <LanguageSelector />
        </div>

        {/* Form Container */}
        <div className="mx-auto my-auto w-full max-w-md py-4">
          <div className="mb-8 text-center md:text-left">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              {t("auth.register.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("auth.register.subtitle")}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {errorMsg && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <p className="text-center text-sm font-medium text-red-500">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Username & Email row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">
                        {t("auth.register.username")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("auth.register.username")}
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">
                        {t("auth.register.email")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("auth.register.email")}
                          className="h-11 rounded-lg border-border bg-muted/40 px-3.5 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t("auth.register.password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("auth.register.password")}
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

              {/* Confirm Password field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t("auth.register.confirmPassword")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t("auth.register.confirmPassword")}
                          className="h-11 rounded-lg border-border bg-muted/40 pr-10 pl-3.5 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showConfirmPassword ? (
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

              {/* Country Select */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t("auth.register.country")}
                    </FormLabel>
                    <FormControl>
                      <Select
                        placeholder={
                          loadingCountries
                            ? "..."
                            : errorCountries
                              ? t("auth.register.countryError")
                              : t("auth.register.countryPlaceholder")
                        }
                        options={countries}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loadingCountries || errorCountries}
                        className="rounded-lg border-border bg-muted/40 text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms and Conditions */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer text-xs font-normal text-muted-foreground">
                        {t("auth.register.acceptTerms")}
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("auth.register.submitting")}
                  </>
                ) : (
                  t("auth.register.submit")
                )}
              </Button>
            </form>
          </Form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              {t("auth.register.alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="font-semibold text-secondary hover:underline"
              >
                {t("auth.register.loginLink")}
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
