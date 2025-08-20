import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VideoChat from "../components/video-chat/VideoChat";
import TextChat from "../components/text-chat/TextChat";
import PostGrid from "../components/community/PostGrid";
import PostForm from "../components/community/PostForm";
import PostItem from "../components/community/PostItem";
import BadgeDisplay from "../components/premium/BadgeDisplay";
import { useSocket } from "../hooks/useSocket";
import { useAnonymousId } from "../hooks/useAnonymousId";
import { usePremiumStatus } from "../hooks/usePremiumStatus";
import VoodoPandaLogo from "../assets/logo.png";
import getApiUrl from "../utils/apiUrl";

// Ad Components
import CommunityAdInjector from "../components/ads/CommunityAdInjector";

const ChatPage = () => {
  const { onlineUsers } = useSocket();
  const { anonymousId, anonymousName } = useAnonymousId();
  const [chatTab, setChatTab] = useState("video");
  const [showCommunity, setShowCommunity] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  
  // Premium badge from unified hook
  const { badgeData: userBadge } = usePremiumStatus();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode === "video" || mode === "text") {
      setChatTab(mode);
      console.log("Setting chat mode to:", mode);
    }
    if (mode === "posts") {
      setShowCommunity(true);
      setSidebarOpen(true);
      console.log("Showing posts sidebar");
    }
  }, []);

  useEffect(() => {
    if (!showCommunity) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(
          getApiUrl(`/posts?page=${page}&limit=20`),
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server");
        }

        const data = await response.json();
        if (data.success) {
          if (page === 1) {
            setPosts(data.data);
          } else {
            setPosts((prevPosts) => [...prevPosts, ...data.data]);
          }
          setHasMore(page < data.pagination.pages);
        } else {
          throw new Error(data.message || "Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error in post loading process:", error);
        let errorMessage = "Failed to load posts. ";
        if (error.name === "AbortError") {
          errorMessage += "Request timed out. ";
        } else if (error.message.includes("<!doctype")) {
          errorMessage += "API server is not responding correctly. ";
        }
        errorMessage +=
          "Please ensure the backend server is running at http://localhost:5000.";
        setError(errorMessage);
        if (page === 1) {
          setPosts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [showCommunity, page]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
        setShowCommunity(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setShowPostForm(false);
  };

  const handlePostReaction = (postId, updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === postId ? updatedPost : post))
    );
    if (updatedPost.hidden) {
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    }
  };

  const togglePostForm = () => {
    setShowPostForm(!showPostForm);
    setSidebarOpen(true);
  };

  const toggleCommunity = () => {
    if (window.innerWidth < 1280) {
      navigate("/community");
    } else {
      setShowCommunity(!showCommunity);
      setSidebarOpen(!showCommunity);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-black text-white relative flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse sm:w-96 sm:h-96"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000 sm:w-96 sm:h-96"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000 sm:w-96 sm:h-96"></div>
      </div>

      <AnimatePresence>
        {sidebarOpen && showCommunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 xl:hidden"
            onClick={() => {
              setSidebarOpen(false);
              setShowCommunity(false);
            }}
          />
        )}
      </AnimatePresence>

      {showCommunity && (
        <div className="fixed bottom-4 right-4 z-50 xl:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePostForm}
            className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-2xl shadow-2xl transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </motion.button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 pb-2 sm:pt-6 sm:pb-4 h-auto sm:h-[120px] relative z-10 px-4 sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center sm:justify-start mb-2 sm:mb-0"
        >
          <img
            src={VoodoPandaLogo}
            alt="Voodo Panda Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
          />
          <div className="ml-2 flex items-center space-x-2">
            <span className="text-lg sm:text-xl font-bold text-white">
              Voodo Chat
            </span>
            {userBadge && (
              <BadgeDisplay badge={userBadge} size="sm" showTooltip={true} />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center flex-1 mb-2 sm:mb-0"
        >
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-1 sm:p-2 inline-flex shadow-2xl border border-white/10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-6 py-2 rounded-xl text-white font-medium text-sm transition-all duration-300 relative overflow-hidden ${
                chatTab === "video"
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg"
                  : "bg-transparent hover:bg-white/10"
              }`}
              onClick={() => {
                setChatTab("video");
              }}
            >
              {chatTab === "video" && (
                <motion.div
                  layoutId="chatTab"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Video Chat</span>
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-6 py-2 rounded-xl text-white font-medium text-sm transition-all duration-300 relative overflow-hidden ${
                chatTab === "text"
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg"
                  : "bg-transparent hover:bg-white/10"
              }`}
              onClick={() => {
                setChatTab("text");
              }}
            >
              {chatTab === "text" && (
                <motion.div
                  layoutId="chatTab"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Text Chat</span>
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center sm:justify-end space-x-2"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-full px-3 sm:px-4 py-2 inline-flex items-center border border-white/20 shadow-lg">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-lg"></span>
            </span>
            <span className="text-white font-medium text-sm">
              {onlineUsers} online
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCommunity}
            className={`px-3 py-2 rounded-2xl font-medium text-sm transition-all duration-300 border ${
              showCommunity
                ? "bg-gradient-to-r from-violet-600 to-purple-600 border-violet-500/30"
                : "bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/10 hover:border-violet-500/30"
            }`}
            title="Toggle Posts"
          >
            Community
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="flex h-[calc(100vh-120px)] overflow-hidden relative z-10">
        <motion.div
          className="flex-1 min-w-0 overflow-y-auto transition-all duration-500"
          animate={{
            marginRight:
              showCommunity && window.innerWidth >= 1280 ? "25rem" : "0rem",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={chatTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full"
            >
              {chatTab === "video" ? (
                <VideoChat />
              ) : (
                <div className="h-full overflow-hidden">
                  <TextChat />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {showCommunity && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{
              x: sidebarOpen || window.innerWidth >= 1280 ? "0%" : "100%",
            }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 right-0 z-50 h-screen w-[85vw] max-w-[480px] bg-black/40 backdrop-blur-xl border-l border-white/10 xl:block"
          >
            <div className="p-3 h-full flex flex-col overflow-y-auto">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Community</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCommunity}
                  className="p-2 text-gray-400 hover:text-violet-400 xl:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              <AnimatePresence>
                {showPostForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-3 border-b border-white/10 bg-white/5 backdrop-blur-sm p-3 rounded-2xl"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-lg">
                        {anonymousName.substring(5, 7)}
                      </div>
                      <div className="flex-1">
                        <PostForm
                          anonymousId={anonymousId}
                          anonymousName={anonymousName}
                          onPostCreated={handlePostCreated}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-3 flex items-center justify-between px-2">
                <h3 className="text-sm font-semibold text-gray-400">
                  Latest Posts
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePostForm}
                  className="px-3 py-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Post
                </motion.button>
              </div>

              <div className="flex-1">
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 text-center"
                  >
                    <div className="text-3xl mb-2">😕</div>
                    <h3 className="text-sm font-semibold mb-2 text-white">
                      Something went wrong
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">{error}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setError(null);
                        setPage(1);
                      }}
                      className="px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-white font-semibold text-xs hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Try Again
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <CommunityAdInjector 
                      posts={posts}
                      shouldShowAds={!userBadge} // Show ads only for non-premium users
                      compact={true}
                    >
                      {(postsWithAds, AdComponent) => (
                        <div className="space-y-3">
                          {postsWithAds.map((item, index) => {
                            if (item.isAd) {
                              return (
                                <AdComponent 
                                  key={item._id}
                                  adIndex={item.adIndex}
                                  compact={true}
                                />
                              );
                            }
                            
                            // Render actual post using PostItem component
                            return (
                              <div key={item._id} className="break-inside-avoid">
                                <PostItem
                                  post={item}
                                  anonymousId={anonymousId}
                                  onReaction={handlePostReaction}
                                  index={index}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CommunityAdInjector>

                    {posts.length > 0 && (
                      <div className="p-3 border-t border-white/10">
                        {loading && page > 1 ? (
                          <div className="flex justify-center">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 bg-violet-500 rounded-full animate-pulse"></div>
                              <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
                              <div className="h-2 w-2 bg-pink-500 rounded-full animate-pulse delay-200"></div>
                            </div>
                          </div>
                        ) : hasMore ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLoadMore}
                            className="w-full py-2 text-violet-400 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 border border-white/10 hover:border-violet-500/30 font-medium text-xs"
                          >
                            Load More
                          </motion.button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-400"
                          >
                            <div className="text-3xl mb-2">✨</div>
                            <p className="text-xs">You've reached the end!</p>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {!loading && posts.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 text-center"
                      >
                        <div className="text-3xl mb-2">✨</div>
                        <h3 className="text-sm font-semibold mb-2 text-white">
                          No posts yet
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">
                          Be the first to share something!
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={togglePostForm}
                          className="px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-white font-semibold text-xs hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Create Post
                        </motion.button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
