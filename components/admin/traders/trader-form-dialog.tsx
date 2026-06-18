"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role is required"),
  status: z.enum(["live", "discontinued"]),
  metrics: z.object({
    winRate: z.coerce.number().min(0).max(100),
    monthlyReturn: z.coerce.number(),
    minInvestment: z.coerce.number().min(0),
    profitShareFee: z.coerce.number().min(0).max(100),
  }),
  simulationProfile: z.object({
    volatility: z.enum(["low", "medium", "high"]),
    trend: z.enum(["bullish", "bearish", "neutral"]),
    dailyExpectedReturnPct: z.coerce.number(),
  }),
})

type FormValues = z.infer<typeof formSchema>

interface TraderFormDialogProps {
  isOpen: boolean
  onClose: () => void
  trader: any | null
  onSuccess: () => void
}

export function TraderFormDialog({
  isOpen,
  onClose,
  trader,
  onSuccess,
}: TraderFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      status: "live",
      metrics: {
        winRate: 0,
        monthlyReturn: 0,
        minInvestment: 0,
        profitShareFee: 10,
      },
      simulationProfile: {
        volatility: "medium",
        trend: "neutral",
        dailyExpectedReturnPct: 0.1,
      },
    },
  })

  useEffect(() => {
    if (trader) {
      form.reset({
        name: trader.name,
        role: trader.role,
        status: trader.status,
        metrics: {
          winRate: trader.metrics.winRate,
          monthlyReturn: trader.metrics.monthlyReturn,
          minInvestment: trader.metrics.minInvestment,
          profitShareFee: trader.metrics.profitShareFee,
        },
        simulationProfile: {
          volatility: trader.simulationProfile.volatility,
          trend: trader.simulationProfile.trend,
          dailyExpectedReturnPct:
            trader.simulationProfile.dailyExpectedReturnPct,
        },
      })
      setImagePreview(trader.avatar || null)
    } else {
      form.reset({
        name: "",
        role: "",
        status: "live",
        metrics: {
          winRate: 0,
          monthlyReturn: 0,
          minInvestment: 0,
          profitShareFee: 10,
        },
        simulationProfile: {
          volatility: "medium",
          trend: "neutral",
          dailyExpectedReturnPct: 0.1,
        },
      })
      setImagePreview(null)
      setImageBase64(null)
    }
  }, [trader, form, isOpen])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImageBase64(base64String)
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...values,
        ...(imageBase64 && { avatarBase64: imageBase64 }),
      }

      const url = trader
        ? `/api/admin/traders/${trader._id}`
        : "/api/admin/traders"
      const method = trader ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Something went wrong")
      }

      toast.success(
        trader ? "Trader updated successfully" : "Trader created successfully"
      )
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{trader ? "Edit Trader" : "Add New Trader"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-2">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-border/50 bg-muted/50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Avatar Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  )}
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setImageBase64(null)
                      }}
                      className="absolute top-1 right-1 rounded-full bg-background/80 p-1 text-muted-foreground backdrop-blur-sm hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  >
                    <Upload className="h-3 w-3" />
                    Upload Image
                  </label>
                </div>
              </div>

              <div className="w-full flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Senior Analyst" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          options={[
                            { value: "live", label: "Live" },
                            { value: "discontinued", label: "Discontinued" },
                          ]}
                          placeholder="Select status"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="border-b pb-2 text-sm font-medium">Metrics</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="metrics.winRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Win Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metrics.monthlyReturn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Return (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metrics.minInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Investment ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metrics.profitShareFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profit Share Fee (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="border-b pb-2 text-sm font-medium">
                Simulation Profile
              </h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="simulationProfile.volatility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volatility</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          { value: "low", label: "Low" },
                          { value: "medium", label: "Medium" },
                          { value: "high", label: "High" },
                        ]}
                        placeholder="Select"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="simulationProfile.trend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trend</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          { value: "bullish", label: "Bullish" },
                          { value: "bearish", label: "Bearish" },
                          { value: "neutral", label: "Neutral" },
                        ]}
                        placeholder="Select"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="simulationProfile.dailyExpectedReturnPct"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Return (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {trader ? "Save Changes" : "Create Trader"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
