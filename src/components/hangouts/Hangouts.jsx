import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { hangoutsApi } from '../../services/api';

// Fallback mock data in case API fails
const mockPosts = [
  {
    id: 1,
    username: 'night_owl',
    imageUrl: 'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1391&q=80',
    description: 'Late night vibes. Anyone up for a chat?',
    likes: 234,
    comments: 56,
    tags: ['night', 'vibes', 'chat']
  },
  {
    id: 2,
    username: 'aesthetic_dreams',
    imageUrl: 'https://images.unsplash.com/photo-1620503374956-c942862f0372?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    description: 'Found this perfect spot for stargazing. The sky was unreal.',
    likes: 512,
    comments: 89,
    tags: ['sky', 'stars', 'night']
  },
  {
    id: 3,
    username: 'digital_wanderer',
    imageUrl: 'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    description: 'Cyberpunk dreams. Feeling the neon tonight.',
    likes: 789,
    comments: 104,
    tags: ['cyberpunk', 'neon', 'aesthetic']
  }
];

const HangoutsPost = ({ post }) => {
  return (
    <motion.div 
      className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="relative">
        <img 
          src={post.imageUrl} 
          alt={post.description} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center">
            <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-2">
              {post.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-white font-medium">{post.username}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-white mb-4">{post.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-purple-900 bg-opacity-50 text-purple-200 text-xs px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between text-gray-300 text-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {post.likes}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
            </svg>
            {post.comments}
          </div>
          <button className="text-purple-400 hover:text-purple-300">
            Chat Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Hangouts = () => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    // Fetch hangouts from API
    const fetchHangouts = async () => {
      try {
        const data = await hangoutsApi.getHangouts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching hangouts:', error);
        // Fallback to mock data if API fails
        setPosts(mockPosts);
      }
    };
    
    fetchHangouts();
  }, []);
  
  return (
    <div className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Voodo Hangouts</h2>
        <p className="text-purple-300">Discover interesting people and conversations</p>
      </motion.div>
      
      <div className="max-w-6xl mx-auto">
        {posts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <HangoutsPost key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
      
      <div className="text-center mt-12">
        <motion.button
          className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white py-3 px-8 rounded-full font-semibold shadow-lg hover:from-purple-700 hover:to-fuchsia-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Coming Soon: Create Your Own Hangout
        </motion.button>
      </div>
    </div>
  );
};

export default Hangouts;
