'use client'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/237698518825"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center 
                 justify-center w-14 h-14 bg-green-500 hover:bg-green-600 
                 rounded-full shadow-lg transition-all duration-300 
                 hover:scale-110"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
    </a>
  )
}
