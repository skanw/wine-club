import React, { useState } from "react";
import { AuthUser } from "wasp/auth"
import { useRedirectHomeUnlessUserIsAdmin } from "../../../admin/useRedirectHomeUnlessUserIsAdmin"

interface Message {
  id: string;
  sender: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

function AdminMessages({user} : {user: AuthUser}) {
  useRedirectHomeUnlessUserIsAdmin({user})

  // Mock data - replace with actual API call
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'wine-member@example.com',
      subject: 'Subscription Inquiry',
      content: 'I have questions about my wine subscription...',
      timestamp: new Date('2024-12-24T10:00:00Z'),
      isRead: false
    },
    {
      id: '2', 
      sender: 'support@winecave.com',
      subject: 'Welcome to Wine Club',
      content: 'Thank you for joining our premium wine club...',
      timestamp: new Date('2024-12-23T15:30:00Z'),
      isRead: true
    }
  ]);

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div className="lux-container-content min-h-screen py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-bordeaux-900 dark:text-champagne-100">
          Messages
        </h1>
        <p className="text-bordeaux-700 dark:text-champagne-300 mt-2">
          Manage customer communications and support requests
        </p>
        {unreadCount > 0 && (
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-bordeaux-100 dark:bg-bordeaux-900 text-bordeaux-800 dark:text-bordeaux-200 text-sm font-medium">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-bordeaux-950 rounded-lg shadow-lg border border-bordeaux-100 dark:border-bordeaux-800">
        <div className="p-6">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-bordeaux-500 dark:text-champagne-400">
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm mt-2">Customer messages will appear here</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-bordeaux-50 dark:hover:bg-bordeaux-900 ${
                    message.isRead 
                      ? 'border-bordeaux-200 dark:border-bordeaux-700 bg-white dark:bg-bordeaux-950' 
                      : 'border-champagne-300 dark:border-champagne-600 bg-champagne-50 dark:bg-champagne-900/20'
                  }`}
                  onClick={() => markAsRead(message.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`font-medium ${
                          message.isRead 
                            ? 'text-bordeaux-900 dark:text-champagne-100' 
                            : 'text-bordeaux-900 dark:text-champagne-100 font-semibold'
                        }`}>
                          {message.subject}
                        </h3>
                        {!message.isRead && (
                          <span className="w-2 h-2 bg-champagne-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-bordeaux-600 dark:text-champagne-300 mb-2">
                        From: {message.sender}
                      </p>
                      <p className="text-bordeaux-700 dark:text-champagne-200 text-sm line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                    <div className="text-xs text-bordeaux-500 dark:text-champagne-400 ml-4">
                      {message.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminMessages
