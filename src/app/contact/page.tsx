"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(z.object({
      name: z.string().min(2, {
        message: "Name must be at least 6 characters.",
      }),
      email: z.string().email({
        message: "Please enter a valid email address.",
      }),
      message: z.string().min(10, {
        message: "Message must be at least 10 characters.",
      }),
    })),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  useEffect(() => {
    setIsVisible(true)
    emailjs.init(process.env.NEXT_PUBLIC_USER_ID!)
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        {
          from_name: values.name,
          from_email: values.email,
          message: values.message,
        }
      )
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon.",
      })
      form.reset()
    } catch (error) {
      console.error("Failed to send email:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
            >
              <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-lg border-amber-200 dark:border-slate-700 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-center text-amber-800 dark:text-amber-200 transition-colors duration-300">
                    Contact Us
                  </CardTitle>
                  <CardDescription className="text-center text-lg mt-2 text-amber-600 dark:text-amber-400 transition-colors duration-300">
                    We&apos;d love to hear from you. Send us a message!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600 transition-colors duration-300"
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
                              <FormLabel>Your Email</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="email"
                                  className="bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600 transition-colors duration-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600 transition-colors duration-300"
                                  rows={5}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 active:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                              Send Message
                            </span>
                          )}
                        </Button>
                      </form>
                    </Form>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-2 transition-colors duration-300">
                          Contact Information
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          Feel free to reach out to us using the following contact details:
                        </p>
                      </div>
                      <ContactInfo icon={Mail} text="khanshariq92213@gmail.com" />
                      <ContactInfo icon={Phone} text="+91 72081 79779" />
                      <ContactInfo icon={MapPin} text="Mumbai, India - 400612" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function ContactInfo({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <motion.div
      className="flex items-center text-amber-700 dark:text-amber-300 transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Icon className="h-5 w-5 mr-2" aria-hidden="true" />
      <span>{text}</span>
    </motion.div>
  )
}