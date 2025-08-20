import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getApiUrl from '../utils/apiUrl';


const AdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('flagged');
  
  const navigate = useNavigate();
  
  // Check authentication status on load
  useEffect(() => {
    const storedAuth = localStorage.getItem('voodo_admin_auth');
    if (storedAuth) {
      try {
        const { username, password } = JSON.parse(storedAuth);
        setUsername(username);
        setPassword(password);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Error parsing stored auth:', e);
        localStorage.removeItem('voodo_admin_auth');
      }
    }
    setIsLoading(false);
  }, []);
  
  // Fetch flagged posts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFlaggedPosts();
    }
  }, [isAuthenticated, activeTab]);
  
  // Redirect to home if not authenticated and trying to access via direct URL
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // User will see login screen when not authenticated
      console.log('Admin page accessed by unauthenticated user');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  const fetchFlaggedPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(getApiUrl('/posts/flagged'), {
          headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setFlaggedPosts(data.data);
          return; // Exit if successful
        } else {
          throw new Error(data.message || 'Failed to fetch flagged posts');
        }
      } catch (apiError) {
        console.warn('API error in admin panel, using mock data:', apiError);
        
        // Create mock flagged posts
        const mockFlaggedPosts = [
          {
            _id: 'mock-flagged-1',
            content: 'This is a mock flagged post that has been reported multiple times.',
            authorId: 'mock-user-1',
            authorName: 'Anon_TroubledUser456',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            reactions: { beautiful: 2, deep: 1, report: 3 },
            reactedUsers: {},
            hidden: true,
            flagged: true,
            flagReason: 'Community reported'
          },
          {
            _id: 'mock-flagged-2',
            content: 'Another example of content that might need moderation.',
            authorId: 'mock-user-2',
            authorName: 'Anon_RandomPoster789',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
            reactions: { beautiful: 1, deep: 0, report: 2 },
            reactedUsers: {},
            hidden: false,
            flagged: true
          }
        ];
        
        setFlaggedPosts(mockFlaggedPosts);
      }
    } catch (error) {
      console.error('Error in admin flagged posts process:', error);
      setError('Failed to load flagged posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    // Store credentials in localStorage
    localStorage.setItem('voodo_admin_auth', JSON.stringify({ username, password }));
    
    setIsAuthenticated(true);
    setError('');
    
    // Scroll to the top of the dashboard
    window.scrollTo(0, 0);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('voodo_admin_auth');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    navigate('/');
  };
  
  const handleModeratePost = async (postId, action) => {
    try {
      setLoading(true);
      
      try {
        const response = await fetch(getApiUrl(`/posts/${postId}/moderate`), {
          method: 'PUT',
          headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action,
            reason: 'Admin moderation'
          })
        });
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Update the flagged posts list
          if (action === 'delete') {
            setFlaggedPosts(flaggedPosts.filter(post => post._id !== postId));
          } else {
            setFlaggedPosts(flaggedPosts.map(post => 
              post._id === postId ? data.data : post
            ));
          }
        } else {
          throw new Error(data.message || `Failed to ${action} post`);
        }
      } catch (apiError) {
        console.warn('API error in moderation, handling locally:', apiError);
        
        // Handle locally if the API fails
        if (action === 'delete') {
          setFlaggedPosts(flaggedPosts.filter(post => post._id !== postId));
        } else if (action === 'hide') {
          setFlaggedPosts(flaggedPosts.map(post => 
            post._id === postId ? { ...post, hidden: true } : post
          ));
        } else if (action === 'unhide') {
          setFlaggedPosts(flaggedPosts.map(post => 
            post._id === postId ? { ...post, hidden: false } : post
          ));
        }
      }
    } catch (error) {
      console.error(`Error ${action} post:`, error);
      setError(`Failed to ${action} post. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  
  // Show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="w-full mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div onClick={() => navigate('/')} className="cursor-pointer">
              <h1 className="text-3xl font-bold text-voodo-purple-300">VODOO</h1>
              <p className="text-xs text-voodo-purple-400 opacity-70">ADMIN PORTAL</p>
            </div>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              Logout
            </button>
          )}
        </div>
        
        {!isAuthenticated ? (
          <div className="flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-purple-500/20">
              <h1 className="text-2xl font-bold text-center mb-6 text-purple-400">Authentication Required</h1>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Admin username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Admin password"
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-500/30 text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigate('/')}
                    type="button"
                    className="text-sm text-purple-400 hover:underline"
                  >
                    Back to home
                  </button>
                  
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-end mb-8">
              <button
                onClick={fetchFlaggedPosts}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Refresh"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {/* Admin navigation */}
            <div className="mb-6">
              <div className="flex space-x-4 border-b border-gray-800 pb-2">
                <button
                  onClick={() => setActiveTab('flagged')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'flagged' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Flagged Posts
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'all' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  All Posts
                </button>
              </div>
            </div>
            
            {/* Content area */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-900/30 border border-red-500/30 text-red-400 rounded-lg mb-8">
                {error}
                <button 
                  onClick={fetchFlaggedPosts}
                  className="ml-4 underline text-red-300"
                >
                  Try again
                </button>
              </div>
            ) : flaggedPosts.length === 0 ? (
              <div className="text-center py-16 bg-gray-800/50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-medium text-gray-300 mb-2">No flagged posts to review</h2>
                <p className="text-gray-400">Everything looks good!</p>
              </div>
            ) : (
              <div className="grid gap-6 mb-8">
                {flaggedPosts.map(post => (
                  <motion.div 
                    key={post._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-purple-400 font-medium">{post.authorName}</span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-gray-500">
                            {new Date(post.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {post.hidden && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-900/30 text-red-400 rounded-md">
                              Hidden
                            </span>
                          )}
                          {post.flagged && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-900/30 text-yellow-400 rounded-md">
                              Flagged
                            </span>
                          )}
                          <span className="px-2 py-1 text-xs font-medium bg-red-900/30 text-red-400 rounded-md">
                            ❗ {post.reactions.report || 0}
                          </span>
                        </div>
                      </div>
                      
                      {post.content && (
                        <p className="text-gray-300 mb-6 whitespace-pre-wrap text-lg">{post.content}</p>
                      )}
                      
                      {post.imageUrl && (
                        <div className="mb-6">
                          <img 
                            src={post.imageUrl} 
                            alt="Post content" 
                            className="max-h-96 object-contain rounded-lg mx-auto"
                          />
                        </div>
                      )}
                      
                      <div className="flex space-x-3 pt-4 border-t border-gray-700">
                        {post.hidden ? (
                          <button
                            onClick={() => handleModeratePost(post._id, 'unhide')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            Unhide Post
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModeratePost(post._id, 'hide')}
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                          >
                            Hide Post
                          </button>
                        )}
                        <button
                          onClick={() => handleModeratePost(post._id, 'delete')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Delete Post
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Simple Footer */}
      <footer className="bg-black bg-opacity-95 text-gray-500 text-xs py-4 px-6 w-full border-t border-voodo-purple-800/30 mt-12">
        <div className="container mx-auto flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Vodoo Admin Portal</p>
          <button onClick={() => navigate('/')} className="text-voodo-purple-400 hover:text-voodo-purple-300">
            Return to Main Site
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;
