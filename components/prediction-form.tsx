"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Controller } from "react-hook-form";
import { toast } from "./hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Textarea } from "./ui/text-area"
import { DateTimePicker } from '@mantine/dates';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label";
import { createPredictionAction } from "@/app/actions";
import dayjs from "dayjs";
import Link from "next/link"

const FormSchema = z.object({
  prediction: z
    .string()
    .min(10, {
      message: "Prediction must be at least 10 characters.",
    })
    .max(150, {
      message: "Prediction must not be longer than 150 characters",
    })
    .regex(/^[a-zA-Z0-9\s.,!?'"()-]+$/, {
      message: "No special characters",
    }),
  modifier: z.enum(["nothing", "before", "on", "after"]),
  predictionDate: z.date().optional(),
}).refine((data) => {
  if (data.modifier !== "nothing") {
    return !!data.predictionDate;
  }
  return true;
}, {
  message: "Prediction date is required when a modifier is selected",
  path: ["predictionDate"],
});

export function PredictionForm() {
    const [loading, setLoading] = useState(false);  // Add loading state
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        modifier: "nothing"
      }
    });
  
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true); // Set loading to true when submitting
        try {
            const message = await createPredictionAction(
                `${data.prediction} (${data.modifier == "nothing" ? "" : data.modifier} ${dayjs(data.predictionDate).format('YYYY-MM-DD HH-mm-ss')})`
            );
            toast({
                title: message[0],
                description: (
                    <div>
                    {message[1]}
                      <pre className="mt-2 w-[340px] max-h-[200px] overflow-y-auto rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                      </pre>
                      </div>
                ),
            });
        } finally {
            setLoading(false);
        }
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="prediction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your prediction</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What is going to happen in the future?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This prediction will live on forever, so choose your words wisely.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          
          <FormItem>
            <FormLabel>Expiry template (optional)</FormLabel>
            <div className="flex justify-between items-center">
            <div className="w-[48%]">
              <FormField
                control={form.control}
                name="modifier"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a modifier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nothing">modifier</SelectItem>
                      <SelectItem value="before">before</SelectItem>
                      <SelectItem value="on">on</SelectItem>
                      <SelectItem value="after">after</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              </div>
              <div className="w-[48%]">
              <Controller
                control={form.control}
                name="predictionDate"
                render={({ field }) => (
                  <DateTimePicker
                    clearable
                    placeholder="Pick date and time"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    error={form.formState.errors.predictionDate?.message}
                    disabled={form.watch('modifier') === 'nothing'}
                  />
                )}
              />
            </div>
            </div>
            <FormMessage />
          </FormItem>
          <div>
          <Label className="text-2xl font-bold mb-4">Visibility</Label>
          <h2>All of your predictions are public. Do NOT store sensitive information. If you delete your account, your predictions will be deleted from this application's database but they will remain on the chain. <Link href="/delete">Go here for account deletion &rarr;</Link></h2>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    )
  }
