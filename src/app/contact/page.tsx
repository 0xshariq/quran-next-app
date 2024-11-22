'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import emailjs from '@emailjs/browser'

export default function Component() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setIsVisible(true)
    emailjs.init(process.env.NEXT_PUBLIC_USER_ID!)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const form = event.currentTarget
    const name = form.elements.namedItem('name') as HTMLInputElement
    const email = form.elements.namedItem('email') as HTMLInputElement
    const message = form.elements.namedItem('message') as HTMLTextAreaElement

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        {
          from_name: name.value,
          from_email: email.value,
          message: message.value,
        }
      )
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon.",
      })
      if (formRef.current) {
        formRef.current.reset()
      }
    } catch (error) {
      console.error('Failed to send email:', error)
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          className="bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600 transition-colors duration-300"
                          aria-describedby="name-description"
                        />
                        <p id="name-description" className="sr-only">Please enter your full name</p>
                      </div>
                      <div>
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600 transition-colors duration-300"
                          aria-describedby="email-description"
                        />
                        <p id="email-description" className="sr-only">Please enter a valid email address</p>
                      </div>
                      <div>
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          className="bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600 transition-colors duration-300"
                          rows={5}
                          aria-describedby="message-description"
                        />
                        <p id="message-description" className="sr-only">Please enter your message</p>
                      </div>
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
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-2 transition-colors duration-300">Contact Information</h3>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Feel free to reach out to us using the following contact details:</p>
                      </div>
                      <motion.div 
                        className="flex items-center text-amber-700 dark:text-amber-300 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Mail className="h-5 w-5 mr-2" aria-hidden="true" />
                        <span>khanshariq92213@gmail.com</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-amber-700 dark:text-amber-300 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Phone className="h-5 w-5 mr-2" aria-hidden="true" />
                        <span>+91 72081 79779</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center text-amber-700 dark:text-amber-300 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <MapPin className="h-5 w-5 mr-2" aria-hidden="true" />
                        <span>Mumbai, India - 400612</span>
                      </motion.div>
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