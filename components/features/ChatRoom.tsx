"use client";

import React, { useState, useRef, useEffect } from "react";
import { formatDistanceToNow, isSameDay, differenceInMinutes } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { ArrowLeft, Send, MoreVertical, Check, CheckCheck, User, Trash2, Ban } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Conversation, Message, MessageStatus, User as UserType } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link, useRouter } from "@/navigation";
import { cn } from "@/lib/utils";

interface ChatRoomProps {
  conversation: Conversation;
  initialMessages: Message[];
  currentUser: UserType;
}

interface GroupedMessage {
  message: Message;
  showAvatar: boolean;
  showTime: boolean;
  isFirstInGroup: boolean;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ conversation, initialMessages, currentUser }) => {
  const t = useTranslations('Chat');
  const locale = useLocale();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const otherUser = conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groupMessages = (msgs: Message[]): GroupedMessage[] => {
    const grouped: GroupedMessage[] = [];
    
    msgs.forEach((message, index) => {
      const prevMessage = index > 0 ? msgs[index - 1] : null;
      const isMe = message.senderId === currentUser.id;
      const prevIsMe = prevMessage ? prevMessage.senderId === currentUser.id : null;
      
      const timeDiff = prevMessage 
        ? differenceInMinutes(message.createdAt, prevMessage.createdAt)
        : Infinity;
      
      const showAvatar = !prevMessage || prevIsMe !== isMe || timeDiff > 5;
      const showTime = !prevMessage || timeDiff > 5 || !isSameDay(message.createdAt, prevMessage.createdAt);
      const isFirstInGroup = showAvatar;

      grouped.push({
        message,
        showAvatar,
        showTime,
        isFirstInGroup,
      });
    });

    return grouped;
  };

  const groupedMessages = groupMessages(messages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newMsg: Message = {
      id: tempId,
      senderId: currentUser.id,
      content: newMessage,
      createdAt: new Date(),
      read: false,
      status: "sending",
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate message sending
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, status: "sent" as MessageStatus }
          : msg
      ));
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, status: "delivered" as MessageStatus }
            : msg
        ));
      }, 500);
    }, 500);
  };

  const handleProfileClick = () => {
    router.push(`/users/${otherUser.id}`);
  };

  const renderMessageStatus = (status?: MessageStatus) => {
    if (!status) return null;
    
    switch (status) {
      case "sending":
        return <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />;
      case "sent":
        return <Check className="w-3 h-3 text-white/70" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-white/70" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-300" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/95 backdrop-blur-md flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/messages" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          
          <button 
            onClick={handleProfileClick}
            className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
          >
            <div className="relative flex-shrink-0">
              <Avatar src={otherUser.avatar} alt={otherUser.username} size="sm" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900 leading-tight truncate">
                {otherUser.username}
              </h2>
              <p className="text-xs text-green-600 font-medium">Online</p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="relative" ref={menuRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30">
                <button
                  onClick={() => {
                    handleProfileClick();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t('viewProfile')}
                </button>
                <button
                  onClick={() => {
                    // Clear chat functionality
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('clearChat')}
                </button>
                <button
                  onClick={() => {
                    // Block user functionality
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  {t('blockUser')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-b from-gray-50/50 to-white min-h-0">
        {groupedMessages.map((group, index) => {
          const { message, showAvatar, showTime, isFirstInGroup } = group;
          const isMe = message.senderId === currentUser.id;
          
          return (
            <div key={message.id}>
              {showTime && (
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">
                    {isSameDay(message.createdAt, new Date())
                      ? formatDistanceToNow(message.createdAt, { addSuffix: true, locale: locale === 'ru' ? ru : enUS })
                      : message.createdAt.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { 
                          day: 'numeric', 
                          month: 'short',
                          ...(message.createdAt.getFullYear() !== new Date().getFullYear() && { year: 'numeric' })
                        })
                    }
                  </span>
                </div>
              )}
              
              <div 
                className={cn(
                  "flex gap-2 max-w-[85%] group",
                  isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {!isMe && (
                  <div className="flex-shrink-0 w-8">
                    {showAvatar ? (
                      <Avatar src={otherUser.avatar} alt={otherUser.username} size="sm" />
                    ) : (
                      <div className="w-8" />
                    )}
                  </div>
                )}
                
                <div 
                  className={cn(
                    "relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-sm transition-all duration-200",
                    "hover:shadow-md",
                    isMe 
                      ? "bg-primary text-white rounded-tr-sm" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  <div className={cn(
                    "flex items-center gap-1.5 mt-1.5 justify-end",
                    isMe ? "text-white/70" : "text-gray-400"
                  )}>
                    <span className="text-[10px]">
                      {new Date(message.createdAt).toLocaleTimeString(locale === 'ru' ? 'ru-RU' : 'en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {isMe && renderMessageStatus(message.status)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-gray-50 border-gray-100 focus:bg-white transition-colors rounded-xl"
          />
          <Button 
            type="submit" 
            variant="primary"
            size="icon"
            className="w-10 h-10 rounded-xl flex-shrink-0 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
