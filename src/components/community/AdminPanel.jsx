import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import getApiUrl from '../../utils/apiUrl';

const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('flagged');

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
  }, []);

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchFlaggedPosts();
    }
  }, [isAuthenticated, isOpen, activeTab]);

  const fetchFlaggedPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Create an AbortController to handle timeouts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(getApiUrl('/posts/flagged'), {
          headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Server returned ${response.status}: ${errorText}`);
          throw new Error(`Server returned ${response.status}: ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from server');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setFlaggedPosts(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch flagged posts');
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error('Error in admin panel fetching posts:', error);
      
      // More user-friendly error message
      let errorMessage = 'Failed to load flagged posts. ';
      
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out. ';
      } 
      
      errorMessage += 'Please ensure the backend server is running at http://localhost:5000.';
      
      setError(errorMessage);
      // No mock data fallback - show only real data
      setFlaggedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verify credentials before saving them
      const response = await fetch('/api/posts/flagged', {
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      // Store credentials in localStorage only after successful verification
      localStorage.setItem('voodo_admin_auth', JSON.stringify({ username, password }));
      setIsAuthenticated(true);
      setError('');
      
      // Pre-fetch posts after successful login
      fetchFlaggedPosts();
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('voodo_admin_auth');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleModeratePost = async (postId, action) => {
    try {
      setLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      try {
        const response = await fetch(getApiUrl(`/posts/${postId}/moderate`), {
          method: 'PUT',
          headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action,
            reason: 'Admin moderation'
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Server returned ${response.status}: ${errorText}`);
          throw new Error(`Server returned ${response.status}: ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from server');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Update the flagged posts list
          if (action === 'delete') {
            setFlaggedPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
          } else {
            setFlaggedPosts(prevPosts => 
              prevPosts.map(post => post._id === postId ? data.data : post)
            );
          }
          
          // Show success message
          setError(`Post successfully ${action === 'delete' ? 'deleted' : action === 'hide' ? 'hidden' : 'unhidden'}.`);
          setTimeout(() => setError(''), 2000); // Clear message after 2 seconds
        } else {
          throw new Error(data.message || `Failed to ${action} post`);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error(`Error ${action} post:`, error);
      
      let errorMessage = `Failed to ${action} post. `;
      
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out. ';
      }
      
      errorMessage += 'Please try again.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0 5.986 5.986 0 00-.554-2.084A5 5 0 0010 7z" clipRule="evenodd" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl max-h-[90vh] bg-gray-900/95 rounded-2xl shadow-2xl border border-indigo-500/20 overflow-hidden glass-morphism"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 py-4 px-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Voodoo Admin Panel</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {!isAuthenticated ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 text-gray-100 rounded-lg border border-gray-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all duration-200"
                        placeholder="Admin username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 text-gray-100 rounded-lg border border-gray-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all duration-200"
                        placeholder="Admin password"
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-300 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setActiveTab('flagged')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            activeTab === 'flagged'
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          Flagged Posts
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-all duration-200"
                        >
                          Logout
                        </button>
                        <button
                          onClick={fetchFlaggedPosts}
                          className="p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all duration-200"
                          title="Refresh"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-indigo-500"></div>
                      </div>
                    ) : error ? (
                      <div className={`p-4 rounded-lg ${error.includes('successfully') ? 'bg-green-900/20 border border-green-500/30 text-green-300' : 'bg-red-900/20 border border-red-500/30 text-red-300'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="mb-1">{error}</p>
                            {!error.includes('successfully') && (
                              <p className="text-xs text-red-400/70">
                                Make sure the server is running and that you're correctly authenticated.
                              </p>
                            )}
                          </div>
                          {!error.includes('successfully') && (
                            <button
                              onClick={fetchFlaggedPosts}
                              className="ml-3 px-3 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-sm transition-colors duration-200"
                            >
                              Try again
                            </button>
                          )}
                        </div>
                      </div>
                    ) : flaggedPosts.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg">No flagged posts to review.</p>
                        <p className="mt-2 text-sm text-gray-500">Only actual flagged posts from the database will appear here. No mock data is used.</p>
                        <p className="text-sm mt-2">All community content is currently moderated.</p>
                        <button
                          onClick={fetchFlaggedPosts}
                          className="mt-4 px-4 py-2 bg-indigo-600/70 hover:bg-indigo-600 text-white rounded-md transition-colors duration-200"
                        >
                          Refresh Posts
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                        {flaggedPosts.map(post => (
                          <div
                            key={post._id}
                            className="bg-gray-800/50 rounded-xl border border-gray-700/30 p-5 hover-scale hover:shadow-lg transition-all duration-200"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="text-sm font-medium text-indigo-400">{post.authorName}</span>
                                <span className="mx-2 text-gray-500">•</span>
                                <span className="text-sm text-gray-400">
                                  {new Date(post.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                {post.hidden && (
                                  <span className="px-2 py-1 text-xs font-medium bg-red-900/30 text-red-300 rounded-md">
                                    Hidden
                                  </span>
                                )}
                                {post.flagged && (
                                  <span className="px-2 py-1 text-xs font-medium bg-yellow-900/30 text-yellow-300 rounded-md">
                                    Flagged
                                  </span>
                                )}
                                <span className="px-2 py-1 text-xs font-medium bg-red-900/30 text-red-300 rounded-md">
                                  😴 {post.reactions.boring || 0}
                                </span>
                              </div>
                            </div>

                            {/* Post Content */}
                            <div className="mb-4 bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                              {post.content ? (
                                <p className="text-gray-200 whitespace-pre-wrap text-sm">{post.content}</p>
                              ) : (
                                <p className="text-gray-400 italic text-sm">No text content</p>
                              )}
                            </div>

                            {/* Post Image */}
                            {post.imageUrl && (
                              <div className="mb-4 overflow-hidden rounded-lg border border-gray-700/30">
                                <a href={post.imageUrl} target="_blank" rel="noopener noreferrer" className="block">
                                  <img
                                    src={post.imageUrl}
                                    alt="Post content"
                                    className="w-full max-h-72 object-contain bg-gray-900/50 hover:scale-105 transition-transform duration-200"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTEwIDZIMTRNMTIgNlYxOE0yIDEyQzIgNi40NzcgNi40NzcgMiAxMiAyQzE3LjUyMyAyIDIyIDYuNDc3IDIyIDEyQzIyIDE3LjUyMyAxNy41MjMgMjIgMTIgMjJDNi40NzcgMjIgMiAxNy41MjMgMiAxMloiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                                      e.target.classList.add('p-8');
                                    }}
                                  />
                                </a>
                                <div className="p-2 bg-gray-800/50 text-xs text-gray-400 flex items-center justify-between">
                                  <span>Click image to view full size</span>
                                  <a 
                                    href={post.imageUrl} 
                                    download 
                                    className="text-indigo-300 hover:text-indigo-200"
                                  >
                                    Download
                                  </a>
                                </div>
                              </div>
                            )}

                            <div className="flex space-x-3 mt-3">
                              {post.hidden ? (
                                <button
                                  onClick={() => handleModeratePost(post._id, 'unhide')}
                                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-all duration-200"
                                >
                                  Unhide Post
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleModeratePost(post._id, 'hide')}
                                  className="px-4 py-2 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium transition-all duration-200"
                                >
                                  Hide Post
                                </button>
                              )}
                              <button
                                onClick={() => handleModeratePost(post._id, 'delete')}
                                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-all duration-200"
                              >
                                Delete Post
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;
