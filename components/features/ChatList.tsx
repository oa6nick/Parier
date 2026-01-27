"use client";

import React, { useState, useMemo, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Conversation, User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";

interface ChatListProps {
  conversations: Conversation[];
  currentUser: User;
}

export const ChatList: React.FC<ChatListProps> = ({ conversations, currentUser }) => {
  const t = useTranslations('Chat');
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineStatuses, setOnlineStatuses] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Set online statuses deterministically based on user IDs after mount
    const statuses: Record<string, boolean> = {};
    conversations.forEach(conversation => {
      const otherUser = conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];
      // Deterministic online status based on user ID hash
      const hash = otherUser.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      statuses[otherUser.id] = hash % 3 !== 0; // ~66% online
    });
    setOnlineStatuses(statuses);
  }, [conversations, currentUser.id]);

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter(conversation => {
      const otherUser = getOtherParticipant(conversation);
      const usernameMatch = otherUser.username.toLowerCase().includes(query);
      const messageMatch = conversation.lastMessage?.content.toLowerCase().includes(query);
      return usernameMatch || messageMatch;
    });
  }, [conversations, searchQuery, currentUser.id]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm flex-shrink-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <div className="relative">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search')} 
            className="pl-10 bg-gray-50 border-gray-100 focus:bg-white transition-colors rounded-xl"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-500 mb-1">
                {searchQuery ? t('noSearchResults') : t('noMessages')}
              </p>
              {searchQuery && (
                <p className="text-sm text-gray-400">{t('tryDifferentSearch')}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredConversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              const lastMessage = conversation.lastMessage;
              const isOnline = isMounted ? (onlineStatuses[otherUser.id] ?? false) : false;
              
              return (
                <Link 
                  key={conversation.id} 
                  href={`/messages/${conversation.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                >
                  <div className="relative flex-shrink-0">
                    <Avatar src={otherUser.avatar} alt={otherUser.username} size="md" />
                    {isMounted && isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                    )}
                    {isMounted && !isOnline && otherUser.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-gray-900 truncate">
                          {otherUser.username}
                        </span>
                        {otherUser.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {conversation.updatedAt && (
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2 flex-shrink-0">
                          {formatDistanceToNow(conversation.updatedAt, {
                            addSuffix: false,
                            locale: locale === 'ru' ? ru : enUS,
                          })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        "text-sm truncate flex-1 min-w-0",
                        conversation.unreadCount > 0 
                          ? "font-semibold text-gray-900" 
                          : "text-gray-500"
                      )}>
                        {lastMessage?.senderId === currentUser.id && (
                          <span className="text-gray-400 font-normal mr-1">{t('you')}:</span>
                        )}
                        {lastMessage?.content || t('noMessages')}
                      </p>
                      
                      {conversation.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
