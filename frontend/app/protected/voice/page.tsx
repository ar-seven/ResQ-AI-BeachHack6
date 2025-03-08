'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Mic, MicOff, Phone, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import ReactMarkdown from "react-markdown"
import { useGetUserProfile } from '@/utils/hooks/user'

interface Message {
  content: string
  role: 'user' | 'assistant'
}

function ChatBubble({ message }: { message: Message }) {
  return (
    <div className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'} px-2 py-1`}>
      <div className="max-w-xs w-fit flex items-center gap-1">
        {message.role === 'assistant' && (
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        <div className={`p-2 rounded-lg text-xs ${message.role === 'assistant' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {message.role === 'user' && (
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://avatars.githubusercontent.com/u/83302015?v=4" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}

export default function VoiceChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [transcript, setTranscript] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { data: userProfile } = useGetUserProfile()
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTranscriptRef = useRef<string>('')

  // Initialize Speech Recognition and Synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started')
      }

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        console.log('onresult triggered', event.results)
        const newTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('')
        setTranscript(newTranscript)

        if (newTranscript !== lastTranscriptRef.current && newTranscript.trim()) {
          console.log('Transcript changed:', newTranscript)
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
          silenceTimeoutRef.current = setTimeout(() => {
            if (isRecording && newTranscript.trim()) {
              console.log('Silence detected, submitting:', newTranscript)
              handleSubmit(newTranscript)
            }
          }, 3000)
          lastTranscriptRef.current = newTranscript
        }
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
        setMessages((prev) => [
          ...prev,
          { content: `Speech recognition error: ${event.error}. Please try again.`, role: 'assistant' },
        ])
      }

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended, isRecording:', isRecording)
        if (isRecording && recognitionRef.current) {
          setTimeout(() => {
            try {
              recognitionRef.current.start()
            } catch (e) {
              console.error('Restart failed:', e)
            }
          }, 100)
        }
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { content: 'Voice input is not supported in your browser.', role: 'assistant' },
      ])
    }

    synthRef.current = window.speechSynthesis

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)
    }
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Toggle recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setMessages((prev) => [
        ...prev,
        { content: 'Voice input is not supported in your browser.', role: 'assistant' },
      ])
      return
    }

    if (isRecording) {
      console.log('Stopping recording')
      recognitionRef.current.stop()
      setIsRecording(false)
      if (transcript.trim()) handleSubmit(transcript)
      setTranscript('')
      lastTranscriptRef.current = ''
    } else {
      console.log('Starting recording')
      try {
        recognitionRef.current.start()
        setIsRecording(true)
        setTranscript('')
        lastTranscriptRef.current = ''
      } catch (e) {
        console.error('Start failed:', e)
      }
    }
  }

  // Handle submission
  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return

    console.log('Submitting:', content)
    const userMessage: Message = { content, role: 'user' }
    setMessages((prev) => [...prev, userMessage])
    setTranscript('')
    lastTranscriptRef.current = ''
    setIsLoading(true)
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current)

    try {
      const response = await fetch('http://localhost:8001/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: { messages },
          message: content,
          user_id: userProfile?.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch AI response')

      const data = await response.json()
      const updatedMessages = data.messages.map((msg: any) => ({
        content: typeof msg.content === 'string' ? msg.content : msg.content[0]?.text || 'Error parsing response',
        role: msg.role === 'user' ? 'user' : 'assistant',
      }))

      setMessages(updatedMessages)

      const assistantMessages = updatedMessages.slice(1).filter((msg) => msg.role === 'assistant')
      const latestAssistantMessage = assistantMessages[assistantMessages.length - 1]
      if (latestAssistantMessage && synthRef.current) {
        synthRef.current.cancel()
        const utterance = new SpeechSynthesisUtterance(latestAssistantMessage.content)
        utterance.lang = 'en-US'
        utterance.volume = 1.0
        utterance.rate = 1.0
        utterance.pitch = 1.0
        synthRef.current.speak(utterance)
      }
    } catch (error) {
      console.error('Error fetching AI response:', error)
      setMessages((prev) => [
        ...prev,
        { content: 'Sorry, something went wrong. Please try again.', role: 'assistant' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          const locationMessage = `Location shared: Lat ${latitude}, Lng ${longitude}`
          handleSubmit(locationMessage)
        },
        (error) => {
          console.error('Error getting location:', error)
          setMessages((prev) => [
            ...prev,
            { content: 'Failed to get location. Please enable location services.', role: 'assistant' },
          ])
        }
      )
    } else {
      setMessages((prev) => [
        ...prev,
        { content: 'Geolocation is not supported by your browser.', role: 'assistant' },
      ])
    }
  }

  return (
    <SidebarInset>
      <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <header className="flex h-16 items-center border-b border-gray-700 px-6 shadow-sm">
          <SidebarTrigger className="-ml-2 text-white" />
          <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">ResQ Voice Call</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Emergency Voice Assistant</h1>
            <p className="text-sm text-gray-400 mt-2">
              {isRecording ? 'Listening...' : 'Tap to start speaking'}
            </p>
          </div>
          <Button
            size="icon"
            className={`w-24 h-24 rounded-full shadow-lg transition-all duration-300 ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
            onClick={toggleRecording}
            disabled={isLoading}
          >
            {isRecording ? (
              <MicOff className="h-12 w-12" />
            ) : (
              <Phone className="h-12 w-12" />
            )}
          </Button>
          <div className="text-sm text-gray-300">
            {transcript ? `You said: "${transcript}"` : 'No voice input yet'}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-gray-600 text-white hover:bg-gray-700"
            onClick={handleGetLocation}
            disabled={isLoading}
          >
            <MapPin className="h-4 w-4" />
            Share Location
          </Button>
        </div>
        <Card className="w-full max-w-3xl mx-auto mb-4 rounded-t-lg bg-gray-700 shadow-lg">
          <div
            ref={chatContainerRef}
            className="max-h-40 overflow-y-auto p-2 space-y-2"
          >
            {messages.length <= 1 ? (
              <div className="text-center text-gray-400 text-xs">Conversation will appear here...</div>
            ) : (
              messages.slice(1).map((message, index) => (
                <ChatBubble key={index} message={message} />
              ))
            )}
          </div>
        </Card>
      </div>
    </SidebarInset>
  )
}