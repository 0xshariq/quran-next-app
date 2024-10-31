'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { motion } from "framer-motion"


export default function ContactUs() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset form and show success message
    setName('')
    setEmail('')
    setMessage('')
    setIsSubmitting(false)
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon.",
    })
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">

      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="bg-amber-50 dark:bg-slate-700 border-amber-200 dark:border-slate-600 transition-colors duration-300"
                      rows={5}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-colors duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="mr-2 h-4 w-4" />
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
                    <Mail className="h-5 w-5 mr-2" />
                    <span>khanshariq92213@gmail.com</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center text-amber-700 dark:text-amber-300 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    <span>+91 72081 79779</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center text-amber-700 dark:text-amber-300 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>Mumbai, India - 400612</span>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}