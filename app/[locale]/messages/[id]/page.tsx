import React from "react";
import { ChatRoom } from "@/components/features/ChatRoom";
import { users } from "@/lib/mockData/users";
import { getConversations, getMessages } from "@/lib/mockData/chat";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;
  const currentUser = users[0];
  const conversations = getConversations();
  const conversation = conversations.find((c) => c.id === id);
  
  if (!conversation) {
    notFound();
  }

  const messages = getMessages(id);

  return (
    <div className="fixed inset-0 bg-gray-50 pt-16 pb-20 md:pb-0 overflow-hidden">
      <div className="max-w-2xl mx-auto h-full bg-white shadow-sm md:border-x md:border-gray-100 flex flex-col">
        <ChatRoom 
          conversation={conversation} 
          initialMessages={messages} 
          currentUser={currentUser} 
        />
      </div>
    </div>
  );
}
