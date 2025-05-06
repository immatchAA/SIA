"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Search, Send, User, X, Plus } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getCurrentUser } from "@/lib/api"
import { 
  searchUsers, 
  getUserConversations, 
  getConversationMessages, 
  sendMessage,
  createConversation,
  getProfileImage,
  User as MessageUser,
  Message,
  Conversation 
} from "@/lib/messaging"

// Define types for our components
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  token?: string;
}

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  contactId: number;
  contactName: string;
  conversationId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Clean implementation that fixes the authentication redirect loop
export default function MessagesPage() {
  const router = useRouter()
  
  // Authentication state
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  
  // Messages state
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [messagesLoaded, setMessagesLoaded] = useState(false)
  const [searchResults, setSearchResults] = useState<MessageUser[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  
  // Authentication check with redirect loop prevention
  useEffect(() => {
    console.log('MessagesPage: Running authentication check')
    
    // Skip on server-side rendering
    if (typeof window === 'undefined') {
      console.log('Running on server, skipping auth check')
      return
    }
    
    // Skip if already authenticated
    if (!authLoading) {
      console.log('Auth already checked, skipping')
      return
    }
    
    // Prevent redirect loops using sessionStorage
    const redirectAttempt = sessionStorage.getItem('auth_redirect_attempt')
    const maxRedirects = 2
    
    try {
      // Stop redirecting if we've tried too many times
      if (redirectAttempt && parseInt(redirectAttempt) >= maxRedirects) {
        console.log('Too many redirects, staying on page')
        sessionStorage.removeItem('auth_redirect_attempt')
        setAuthLoading(false)
        return
      }
      
      // Check for auth data in localStorage
      const authToken = localStorage.getItem('authToken')
      const userStr = localStorage.getItem('user')
      
      console.log('Auth token exists:', !!authToken)
      console.log('User data exists:', !!userStr)
      
      if (!authToken || !userStr) {
        console.log('No auth data in localStorage, redirecting to login')
        
        // Track redirect attempts
        const currentAttempts = redirectAttempt ? parseInt(redirectAttempt) : 0
        sessionStorage.setItem('auth_redirect_attempt', (currentAttempts + 1).toString())
        
        router.push('/login')
        return
      }
      
      // Parse user data
      try {
        const userData = JSON.parse(userStr)
        console.log('User authenticated:', userData.email)
        setUser(userData)
        setAuthLoading(false)
        
        // Clear redirect counter on successful auth
        sessionStorage.removeItem('auth_redirect_attempt')
        
        // Load messages for authenticated user
        loadMessages(userData)
      } catch (e) {
        console.error('Error parsing user data:', e)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        router.push('/login')
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
      // Don't remove tokens on simple errors
      setAuthLoading(false)
    }
  }, [router, authLoading])
  
  // Load messages for the user
  const loadMessages = (userData: User) => {
    console.log('Loading messages for user:', userData.name)
    setLoading(true)
    
    // Get conversations using the messaging library
    const userConversations = getUserConversations()
    setConversations(userConversations)
    
    // Check for active conversation
    const savedActiveConversation = localStorage.getItem('redweb_active_conversation')
    
    if (savedActiveConversation) {
      setActiveConversation(savedActiveConversation)
      // Load messages for the active conversation
      const conversationMessages = getConversationMessages(savedActiveConversation)
      setMessages(conversationMessages)
    } else if (userConversations.length > 0) {
      // Set first conversation as active
      const firstConversationId = userConversations[0].conversationId
      setActiveConversation(firstConversationId)
      localStorage.setItem('redweb_active_conversation', firstConversationId)
      
      // Load messages for the first conversation
      const conversationMessages = getConversationMessages(firstConversationId)
      setMessages(conversationMessages)
    }
    
    setLoading(false)
    setMessagesLoaded(true)
  }
  
  // Handle user search for new conversations
  const handleUserSearch = async (query = searchQuery) => {
    setLoading(true)
    try {
      // Even if query is empty, we want to show some users
      const results = await searchUsers(query)
      console.log('Search results found:', results.length, results)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Auto-search when component mounts or search is shown
  useEffect(() => {
    if (showSearch) {
      handleUserSearch('')
    }
  }, [showSearch])
  
  // Create a new conversation with a user
  const createNewConversation = (contact: MessageUser) => {
    const newConversation = createConversation(contact)
    
    // Update local state with the new conversation
    setConversations(prev => {
      // Check if conversation already exists
      const exists = prev.some(c => c.conversationId === newConversation.conversationId)
      if (exists) {
        return prev
      }
      return [newConversation, ...prev]
    })
    
    // Set as active conversation
    setActiveConversation(newConversation.conversationId)
    localStorage.setItem('redweb_active_conversation', newConversation.conversationId)
    
    // Load messages
    const conversationMessages = getConversationMessages(newConversation.conversationId)
    setMessages(conversationMessages)
    
    // Clear search
    setSearchQuery('')
    setSearchResults([])
    setShowSearch(false)
  }
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) {
      return
    }
    
    try {
      // Use the messaging library to send the message
      const newMessage = sendMessage(activeConversation, messageText)
      
      // Add to local messages state
      setMessages(prev => [...prev, newMessage])
      
      // Update conversations in state
      setConversations(prev => prev.map(conv => {
        if (conv.conversationId === activeConversation) {
          return {
            ...conv,
            lastMessage: messageText,
            lastMessageTime: 'Just now'
          }
        }
        return conv
      }))
      
      // Clear input
      setMessageText('')
      
      // Simulate a response after 1-2 seconds if not self-conversation
      if (!activeConversation.includes('self-')) {
        setTimeout(() => {
          const activeContactName = conversations.find(
            c => c.conversationId === activeConversation
          )?.contactName || 'Contact';
          
          const responseMessage: Message = {
            id: Date.now(),
            content: `Thanks for your message! How else can I help you with blood donation?`,
            sender: activeContactName,
            timestamp: new Date().toLocaleTimeString(),
            isOwn: false
          }
          
          // Add to state
          setMessages(prev => [...prev, responseMessage])
          
          // Save to storage
          const conversationMessages = getConversationMessages(activeConversation)
          localStorage.setItem(
            `redweb_messages_${activeConversation}`, 
            JSON.stringify([...conversationMessages, responseMessage])
          )
        }, 1000 + Math.random() * 1000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
  
  // Filter contacts by search query
  const filteredContacts = conversations.filter(contact => 
    contact.contactName?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Get active contact from the active conversation
  const activeContact = conversations.find(c => c.conversationId === activeConversation)
  
  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Verifying authentication...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardNav />
        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            
            {/* Simple messaging UI */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden min-h-[70vh] flex border">
              {/* Conversations list */}
              <div className="w-1/3 border-r overflow-y-auto">
                <div className="p-3 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Conversations</h3>
                    <button 
                      onClick={() => {
                        setShowSearch(!showSearch)
                        if (!showSearch) {
                          setSearchResults([])
                          setSearchQuery('')
                        }
                      }}
                      className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                      title="Search for users"
                    >
                      {!showSearch ? <Plus className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </button>
                  </div>
                  {showSearch ? (
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        className="form-input block w-full rounded-md border-gray-300 focus:border-red-600 focus:ring-red-600"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleUserSearch()
                          }
                        }}
                        autoFocus
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button onClick={handleUserSearch}>
                          <Search className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                  
                  {/* Search results */}
                  {showSearch && (
                    <div className="mt-2 border rounded-md overflow-hidden max-h-80 overflow-y-auto">
                      {searchResults.length > 0 ? searchResults.map((user) => (
                        <div 
                          key={`search-${user.id}`}
                          className="p-2 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer border-b last:border-b-0"
                          onClick={() => createNewConversation(user)}
                        >
                          {user.profilePicture ? (
                            <div className="h-8 w-8 rounded-full overflow-hidden relative">
                              <Image 
                                src={getProfileImage(user, '/images/default-red.jpg')} 
                                alt={user.name}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      )) : loading ? (
                        <div className="p-4 text-center">
                          <Loader2 className="h-5 w-5 animate-spin text-red-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-500">Searching for users...</div>
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <div className="text-sm text-gray-500">Type to search for users</div>
                          <div className="text-xs text-gray-400 mt-1">Or click a name from the list below</div>
                        </div>
                      )}
                      
                      {/* Always show some suggested users */}
                      {showSearch && searchResults.length === 0 && !loading && (
                        <div className="border-t pt-1">
                          <div className="px-2 pt-1 pb-1 text-xs text-gray-500 bg-gray-50">Suggested Users</div>
                          {Array(5).fill(0).map((_, index) => {
                            const user = {
                              id: `suggestion-${100 + index}`,
                              name: ['Sophie Smith', 'John Doe', 'Maria Rodriguez', 'James Wilson', 'Priya Patel'][index],
                              email: [`sophie@redweb.com`, `john@redweb.com`, `maria@redweb.com`, `james@redweb.com`, `priya@redweb.com`][index],
                              role: index % 2 === 0 ? 'DONOR' : 'PATIENT',
                              profilePicture: ''
                            };
                            return (
                              <div 
                                key={`suggestion-${user.id}`}
                                className="p-2 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer border-b last:border-b-0"
                                onClick={() => createNewConversation(user)}
                              >
                                <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Conversations */}
                <div>
                  {loading ? (
                    <div className="flex justify-center items-center h-20">
                      <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                    </div>
                  ) : (
                    conversations.map((conv) => {
                      const isActive = activeConversation === conv.conversationId
                      
                      return (
                        <div
                          key={conv.conversationId}
                          className={`p-3 border-b cursor-pointer ${isActive ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                          onClick={() => {
                            setActiveConversation(conv.conversationId);
                            localStorage.setItem('redweb_active_conversation', conv.conversationId);
                            // Load messages for the selected conversation
                            const conversationMessages = getConversationMessages(conv.conversationId);
                            setMessages(conversationMessages);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {conv.profilePicture ? (
                              <div className="h-10 w-10 rounded-full overflow-hidden relative">
                                <Image 
                                  src={getProfileImage(conv, '/images/default-red.jpg')} 
                                  alt={conv.contactName}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-medium">
                                {conv.contactName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium truncate">{conv.contactName}</h4>
                                <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                              <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">
                                {conv.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
              
              {/* Chat area */}
              <div className="w-2/3 flex flex-col">
                {activeConversation ? (
                  <>
                    {/* Chat header */}
                    <div className="p-3 border-b flex items-center space-x-3">
                      {activeContact?.profilePicture ? (
                        <div className="h-10 w-10 rounded-full overflow-hidden relative">
                          <Image 
                            src={getProfileImage(activeContact, '/images/default-red.jpg')} 
                            alt={activeContact.contactName}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-medium">
                          {activeContact?.contactName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{activeContact?.contactName}</h3>
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {loading ? (
                        <div className="flex justify-center items-center h-full">
                          <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                        </div>
                      ) : (
                        messages.map((msg: Message, index: number) => (
                          <div
                            key={`msg-${msg.id}-${index}`}
                            className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                msg.isOwn === true
                                  ? 'bg-red-600 text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <div className="text-sm mb-1 font-medium">
                                {msg.sender}
                              </div>
                              <div>{msg.content}</div>
                              <div className="text-xs mt-1 opacity-70">
                                {msg.timestamp}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Message input */}
                    <div className="p-3 border-t">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                        <button
                          className="p-2 bg-red-600 text-white rounded-lg"
                          onClick={handleSendMessage}
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // No active conversation
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                      <p>Choose a contact to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
