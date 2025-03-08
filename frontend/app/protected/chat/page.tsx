'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Send, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import ReactMarkdown from "react-markdown";
import { useGetUserProfile } from '@/utils/hooks/user'
interface Message {
  content: string
  role: 'user' | 'assistant'
}

function ChatBubble({ message }: { message: Message }) {
  return (
    <div className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'} px-4 py-2`}>
      <div className="max-w-lg w-fit flex items-center gap-2">
        {message.role === 'assistant' && (
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        <div className={`p-3 rounded-lg text-sm ${message.role === 'assistant' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {message.role === 'user' && (
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/83302015?v=4" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const { data: userProfile } = useGetUserProfile();

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          const locationMessage: Message = {
            content: `Location shared: Lat ${latitude}, Lng ${longitude}`,
            role: 'user',
          }
          setMessages((prev) => [...prev, locationMessage])
        },
        (error) => {
          console.error('Error getting location:', error)
          const errorMessage: Message = {
            content: 'Failed to get location. Please enable location services or type it manually.',
            role: 'assistant',
          }
          setMessages((prev) => [...prev, errorMessage])
        }
      )
    } else {
      const errorMessage: Message = {
        content: 'Geolocation is not supported by your browser.',
        role: 'assistant'
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const userMessage: Message = {
  //       id: Date.now().toString(),
  //       content: `Uploaded file: ${file.name}`,
  //       role: 'user',
  //       timestamp: new Date(),
  //     }
  //     setMessages((prev) => [...prev, userMessage])
  //     if (fileInputRef.current) fileInputRef.current.value = ''
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      content: input,
      role: 'user'
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('https://resq-ai-beachhack6.onrender.com/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // messages: [
          //   ...messages.map((msg) => ({
          //     role: msg.role,
          //     content: msg.content,
          //   })),
          //   { role: 'user', content: input },
          // ],
          history: {"messages": messages},
          message: input,
          user_id:userProfile?.id

        }),
      })

      if (!response.ok) throw new Error('Failed to fetch AI response')

      const data = await response.json()
      const updatedMessages = data.messages.map((msg: any, index: number) => ({
        content: typeof msg.content === 'string' ? msg.content : msg.content[0]?.text || 'Error parsing response',
        role: msg.role === 'user' ? 'user' : 'assistant',
      }))

      setMessages(updatedMessages)
    } catch (error) {
      console.error('Error fetching AI response:', error)
      const errorMessage: Message = {
        content: 'Sorry, something went wrong. Please try again.',
        role: 'assistant',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SidebarInset>
      <div className="flex flex-col h-screen">
        <header className="flex h-16 items-center border-b px-6 shadow-sm">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>ResQ AI Chat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length <= 1 ? (
              <div className="text-center text-muted-foreground">Start by reporting an emergency...</div>
            ) : (
              messages.slice(1).map((message, index) => <ChatBubble key={index} message={message} />)
            )}
        </div>
        <Card className="w-full max-w-3xl mx-auto p-4 mb-4 shadow-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          // onChange={handleFileUpload}
          ref={fileInputRef}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
        <Button
          type="button"
          size="icon"
          className="p-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Upload className="h-5 w-5" />
        </Button>
        <Button // Add this new button
          type="button"
          size="icon"
          className="p-2"
          onClick={handleGetLocation}
          disabled={isLoading}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2v6h4v-6c0-1.104-.896-2-2-2zm9-3h-3v2h3v-2zm-18 0H0v2h3v-2zm9-9v3h2V1h-2z" />
          </svg>
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Report an emergency..."
          className="flex-grow"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading} className="p-2">
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
        </Card>
      </div>
    </SidebarInset>
  )
}