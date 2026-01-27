"use client";

import React, { useEffect } from "react";
import { ChatList } from "@/components/features/ChatList";
import { users } from "@/lib/mockData/users";
import { getConversations, findOrCreateConversation } from "@/lib/mockData/chat";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const currentUser = users[0];
  const conversations = getConversations();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = searchParams?.get('userId');
    if (userId) {
      try {
        const conversation = findOrCreateConversation(userId);
        router.replace(`/messages/${conversation.id}`);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }
  }, [searchParams, router]);

  return (
    <>
      <div className="fixed inset-0 bg-gray-50 pt-16 pb-20 md:pb-0 overflow-hidden">
        <div className="max-w-2xl mx-auto h-full bg-white shadow-sm md:border-x md:border-gray-100 flex flex-col">
          <ChatList conversations={conversations} currentUser={currentUser} />
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}
