import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, Mic, Send } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'user',
      text: 'Hello!',
      timestamp: new Date('2025-05-15T10:20:00'),
    },
    {
      id: '2',
      sender: 'user',
      text: 'Can I try the software first?',
      timestamp: new Date('2025-05-15T10:21:00'),
    },
    {
      id: '3',
      sender: 'bot',
      text: 'Sure. Here is the demo unit. You can use it as long as you want.',
      timestamp: new Date('2025-05-15T10:22:00'),
    },
    {
      id: '4',
      sender: 'user',
      text: 'Thank you. Now I want to buy the software. Which type of subscription do you have?',
      timestamp: new Date('2025-05-15T10:23:00'),
    },
    {
      id: '5',
      sender: 'bot',
      text: 'You are welcome!',
      timestamp: new Date('2025-05-15T10:24:00'),
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: newMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#f6f6fa]">
      {/* Header with BotMAX logo */}
      <header className="bg-[#5b5dcd] p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-bold flex items-center">
          <svg width="30" height="30" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M10 19L19 10M19 10L28 19M19 10V28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          BotMAX
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-[#6a6cf1] hover:bg-[#7b7df4] text-white"
          >
            <Paperclip size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full bg-[#6a6cf1] hover:bg-[#7b7df4] text-white"
          >
            <Mic size={20} />
          </Button>
        </div>
      </header>
      
      {/* Chat Input - First message */}
      <div className="px-4 py-3 border-b">
        <Input 
          type="text" 
          placeholder="Do you have question?" 
          className="w-full rounded-full bg-white"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/avatar-bot.png" />
                <AvatarFallback className="bg-[#5b5dcd] text-white">BM</AvatarFallback>
              </Avatar>
            )}
            <div 
              className={`max-w-[80%] rounded-xl p-3 ${
                message.sender === 'user' 
                  ? 'bg-white text-gray-800 ml-12' 
                  : 'bg-[#5b5dcd] text-white'
              }`}
            >
              {message.text}
            </div>
            {message.sender === 'user' && (
              <Avatar className="h-8 w-8 ml-2">
                <AvatarFallback className="bg-[#fb7185] text-white">US</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      {/* Footer with input */}
      <div className="p-4 bg-white flex space-x-2 items-center rounded-full mx-4 mb-4">
        <Input 
          type="text" 
          placeholder="Type a message..." 
          className="border-0 focus:ring-0 bg-transparent flex-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full h-10 w-10 p-2 bg-[#5b5dcd] text-white hover:bg-[#6a6cf1]"
          onClick={handleSendMessage}
        >
          <Send size={18} />
        </Button>
      </div>

      {/* Bottom action buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-[#5b5dcd] text-white hover:bg-[#6a6cf1]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9.5H21M9 16.5H15M7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-[#fb7185] text-white hover:bg-[#f43f5e]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}