// Messaging functions for RedWeb
import { getCurrentUser } from "./api";

// Define types for our data
export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  profilePicture?: string;
}

export interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Conversation {
  contactId: string | number;
  contactName: string;
  conversationId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  profilePicture?: string;
}

// User search functionality
export const searchUsers = async (query: string): Promise<User[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.error('No authenticated user for search');
    return [];
  }
  
  console.log('Searching for users with query:', query);
  console.log('Current user:', currentUser);
  
  try {
    // First try to fetch from the actual backend API
    const API_URL = 'http://localhost:8080';
    const authToken = localStorage.getItem('authToken');
    
    // Only proceed with API call if we have authentication
    if (authToken) {
      try {
        console.log('Attempting to fetch users from backend');
        const response = await fetch(`${API_URL}/api/users/search?query=${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Users fetched from backend:', data);
          
          // Transform the backend data to match our User interface
          const backendUsers = data.map((user: any) => ({
            id: user.id,
            name: user.firstName && user.lastName ? 
              `${user.firstName} ${user.lastName}` : 
              user.name || user.email.split('@')[0],
            email: user.email,
            role: user.role || 'DONOR',
            profilePicture: user.profilePicture || ''
          }));
          
          // Filter out the current user
          return backendUsers
            .filter(user => String(user.id) !== String(currentUser.id))
            .slice(0, 10);
        }
      } catch (error) {
        console.error('Error fetching users from backend:', error);
        // Fall back to mock data if API fails
      }
    }
  } catch (error) {
    console.error('Error in primary user search mechanism:', error);
    // Continue to mock data fallback
  }
  
  // FALLBACK: If backend request fails or we're in development/testing
  // Generate mock users for demo purposes (include more users)
  const mockUsers: User[] = [
    {
      id: '101',
      name: 'Sophie Smith',
      email: 'sophie@redweb.com',
      role: 'DONOR',
      profilePicture: '/images/profile-sophie.jpg'
    },
    {
      id: '102',
      name: 'John Doe',
      email: 'john@redweb.com',
      role: 'DONOR',
      profilePicture: '/images/profile-john.jpg'
    },
    {
      id: '103',
      name: 'Maria Rodriguez',
      email: 'maria@redweb.com',
      role: 'PATIENT',
      profilePicture: '/images/profile-maria.jpg'
    },
    {
      id: '104',
      name: 'James Wilson',
      email: 'james@redweb.com',
      role: 'DONOR',
      profilePicture: '/images/profile-james.jpg'
    },
    {
      id: '105',
      name: 'Priya Patel',
      email: 'priya@redweb.com',
      role: 'PATIENT',
      profilePicture: '/images/profile-priya.jpg'
    },
    {
      id: '106',
      name: 'Robert Chen',
      email: 'robert@redweb.com',
      role: 'DONOR',
      profilePicture: '/images/profile-robert.jpg'
    },
    {
      id: '107',
      name: 'Emma Johnson',
      email: 'emma@redweb.com',
      role: 'DONOR',
      profilePicture: '/images/profile-emma.jpg'
    },
    {
      id: '108',
      name: 'Michael Brown',
      email: 'michael@redweb.com',
      role: 'PATIENT',
      profilePicture: '/images/profile-michael.jpg'
    },
    {
      id: '109',
      name: 'Sarah Lee',
      email: 'sarah@redweb.com',
      role: 'DONOR',
      profilePicture: '/images/profile-sarah.jpg'
    },
    {
      id: '110',
      name: 'David Kim',
      email: 'david@redweb.com',
      role: 'PATIENT',
      profilePicture: '/images/profile-david.jpg'
    },
    {
      id: '111',
      name: 'Lisa Wong',
      email: 'lisa@redweb.com',
      role: 'DONOR',
      profilePicture: '/images/profile-lisa.jpg'
    },
    {
      id: '112',
      name: 'Alex Garcia',
      email: 'alex@redweb.com',
      role: 'DONOR',
      profilePicture: '/images/profile-alex.jpg'
    }
  ];
  
  // Filter users based on search query
  const lowerQuery = query.toLowerCase();
  
  // If query is empty or very short, return all users except current user
  if (lowerQuery.length < 2) {
    return mockUsers
      .filter(user => String(user.id) !== String(currentUser.id))
      .slice(0, 10);
  }
  
  const filteredUsers = mockUsers
    .filter(user => 
      String(user.id) !== String(currentUser.id) && 
      (user.name.toLowerCase().includes(lowerQuery) || 
       user.email.toLowerCase().includes(lowerQuery))
    )
    .slice(0, 10); // Show up to 10 results
    
  console.log('Filtered users:', filteredUsers);
  return filteredUsers;
};

// Get all user conversations
export const getUserConversations = (): Conversation[] => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.error('No authenticated user for conversations');
    return [];
  }
  
  // Try to load from localStorage first
  try {
    const savedConversations = localStorage.getItem('redweb_conversations');
    if (savedConversations) {
      return JSON.parse(savedConversations);
    }
  } catch (e) {
    console.error('Error loading conversations:', e);
  }
  
  // Create default conversations
  const defaultConversations: Conversation[] = [
    {
      contactId: '101',
      contactName: 'Sophie Smith',
      conversationId: `conv-${currentUser.id}-101`,
      lastMessage: 'Hello, how can I help with your donation?',
      lastMessageTime: new Date().toLocaleTimeString(),
      unreadCount: 2,
      profilePicture: '/images/profile-sophie.jpg'
    }
  ];
  
  // Add self-conversation
  const selfConversation: Conversation = {
    contactId: currentUser.id,
    contactName: `${currentUser.name || 'You'} (You)`,
    conversationId: `self-${currentUser.id}`,
    lastMessage: 'Welcome to RedWeb messaging!',
    lastMessageTime: 'Just now',
    unreadCount: 0,
    profilePicture: currentUser.profilePicture || ''
  };
  
  const conversations = [selfConversation, ...defaultConversations];
  
  // Save to localStorage
  localStorage.setItem('redweb_conversations', JSON.stringify(conversations));
  
  return conversations;
};

// Get messages for a conversation
export const getConversationMessages = (conversationId: string): Message[] => {
  // Try to load from localStorage first
  try {
    const savedMessages = localStorage.getItem(`redweb_messages_${conversationId}`);
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
  } catch (e) {
    console.error('Error loading messages:', e);
  }
  
  // Generate mock messages
  const currentUser = getCurrentUser();
  
  // Different messages based on conversation type
  if (conversationId.startsWith('self-')) {
    // Self conversation
    const welcomeMessages: Message[] = [
      {
        id: 1,
        content: 'Welcome to RedWeb messaging!',
        sender: 'RedWeb',
        timestamp: new Date().toLocaleTimeString(),
        isOwn: false
      },
      {
        id: 2,
        content: 'You can use this system to communicate with donors and patients.',
        sender: 'RedWeb',
        timestamp: new Date().toLocaleTimeString(),
        isOwn: false
      }
    ];
    
    // Save to localStorage
    localStorage.setItem(`redweb_messages_${conversationId}`, JSON.stringify(welcomeMessages));
    
    return welcomeMessages;
  } else {
    // Regular conversation
    const contactId = conversationId.split('-').pop();
    let contactName = 'User';
    
    // Find contact name from our mock users
    const mockUsers = [
      { id: '101', name: 'Sophie Smith' },
      { id: '102', name: 'John Doe' },
      { id: '103', name: 'Maria Rodriguez' },
      { id: '104', name: 'James Wilson' },
      { id: '105', name: 'Priya Patel' }
    ];
    
    const contact = mockUsers.find(u => u.id === contactId);
    if (contact) {
      contactName = contact.name;
    }
    
    // Create messages
    const messages: Message[] = [];
    
    // Different conversations for different users
    if (contactId === '101') {
      // Sophie conversation
      messages.push(
        {
          id: 1,
          content: `Hello ${currentUser?.name || 'there'}! I'm Sophie, a RedWeb coordinator.`,
          sender: 'Sophie Smith',
          timestamp: '10:30 AM',
          isOwn: false
        },
        {
          id: 2,
          content: 'How can I help with your donation process today?',
          sender: 'Sophie Smith',
          timestamp: '10:31 AM',
          isOwn: false
        }
      );
    } else {
      // Generic conversation
      messages.push(
        {
          id: 1,
          content: `Hello ${currentUser?.name || 'there'}! I'm ${contactName}.`,
          sender: contactName,
          timestamp: '10:30 AM',
          isOwn: false
        },
        {
          id: 2,
          content: 'Looking forward to connecting with you on RedWeb.',
          sender: contactName,
          timestamp: '10:31 AM',
          isOwn: false
        }
      );
    }
    
    // Save to localStorage
    localStorage.setItem(`redweb_messages_${conversationId}`, JSON.stringify(messages));
    
    return messages;
  }
};

// Send a message
export const sendMessage = (conversationId: string, content: string): Message => {
  if (!content.trim()) {
    throw new Error('Message cannot be empty');
  }
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  // Create new message
  const newMessage: Message = {
    id: Date.now(),
    content: content.trim(),
    sender: currentUser.name || currentUser.email,
    timestamp: new Date().toLocaleTimeString(),
    isOwn: true
  };
  
  // Add to existing messages
  try {
    const existingMessagesJson = localStorage.getItem(`redweb_messages_${conversationId}`);
    const existingMessages = existingMessagesJson ? JSON.parse(existingMessagesJson) : [];
    const updatedMessages = [...existingMessages, newMessage];
    
    // Save updated messages
    localStorage.setItem(`redweb_messages_${conversationId}`, JSON.stringify(updatedMessages));
    
    // Update conversation last message
    const conversationsJson = localStorage.getItem('redweb_conversations');
    if (conversationsJson) {
      const conversations = JSON.parse(conversationsJson);
      const updatedConversations = conversations.map((conv: Conversation) => {
        if (conv.conversationId === conversationId) {
          return {
            ...conv,
            lastMessage: content.trim(),
            lastMessageTime: 'Just now'
          };
        }
        return conv;
      });
      
      localStorage.setItem('redweb_conversations', JSON.stringify(updatedConversations));
    }
  } catch (e) {
    console.error('Error updating messages:', e);
  }
  
  return newMessage;
};

// Create a new conversation
export const createConversation = (contact: User): Conversation => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  // Generate conversation ID
  const conversationId = `conv-${currentUser.id}-${contact.id}`;
  
  // Create conversation object
  const newConversation: Conversation = {
    contactId: contact.id,
    contactName: contact.name,
    conversationId: conversationId,
    lastMessage: 'New conversation started',
    lastMessageTime: new Date().toLocaleTimeString(),
    unreadCount: 0,
    profilePicture: contact.profilePicture
  };
  
  // Add to existing conversations
  try {
    const existingConversationsJson = localStorage.getItem('redweb_conversations');
    const existingConversations = existingConversationsJson ? JSON.parse(existingConversationsJson) : [];
    
    // Check if conversation already exists
    const existingConversation = existingConversations.find(
      (conv: Conversation) => conv.conversationId === conversationId
    );
    
    if (existingConversation) {
      return existingConversation;
    }
    
    const updatedConversations = [...existingConversations, newConversation];
    localStorage.setItem('redweb_conversations', JSON.stringify(updatedConversations));
    
    // Create initial messages
    const initialMessages: Message[] = [
      {
        id: 1,
        content: `Hello! This is the beginning of your conversation with ${contact.name}.`,
        sender: 'RedWeb',
        timestamp: new Date().toLocaleTimeString(),
        isOwn: false
      }
    ];
    
    localStorage.setItem(`redweb_messages_${conversationId}`, JSON.stringify(initialMessages));
  } catch (e) {
    console.error('Error creating conversation:', e);
  }
  
  return newConversation;
};

// Helper function to get profile image URL
export const getProfileImage = (user: User | Conversation | null, defaultImage = ''): string => {
  if (!user) return defaultImage;
  
  if ('profilePicture' in user && user.profilePicture) {
    return user.profilePicture;
  }
  
  // Generate a color based on user/contact ID for consistent colors
  let seed: number;
  
  if ('id' in user) {
    // It's a User
    seed = typeof user.id === 'string' ? 
      user.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) :
      Number(user.id);
  } else {
    // It's a Conversation, use contactId
    seed = typeof user.contactId === 'string' ? 
      user.contactId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) :
      Number(user.contactId);
  }
  
  const colors = ['red', 'blue', 'green', 'purple', 'orange', 'teal', 'pink'];
  const color = colors[seed % colors.length];
  
  return `/images/default-${color}.jpg`;
};

export default {
  searchUsers,
  getUserConversations,
  getConversationMessages,
  sendMessage,
  createConversation,
  getProfileImage
};
