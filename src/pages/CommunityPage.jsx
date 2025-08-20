import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostGrid from "../components/community/PostGrid";
import PostForm from "../components/community/PostForm";
import { useAnonymousId } from "../hooks/useAnonymousId";
import logoImage from "../assets/logo.png";
import getApiUrl from "../utils/apiUrl";
import { usePremiumStatus } from "../hooks/usePremiumStatus";
import BadgeChip from "../components/common/BadgeChip";

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { anonymousId, anonymousName, resetId } = useAnonymousId();
  const { badgeData } = usePremiumStatus();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPostForm, setShowPostForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [communityStats, setCommunityStats] = useState({
    activeMembers: 0,
    postsToday: 0,
    onlineNow: 0,
  });

  const categories = [
    { id: "all", name: "All Posts", icon: "🌟" },
    { id: "music", name: "Music", icon: "🎵" },
    { id: "art", name: "Art", icon: "🎨" },
    { id: "technology", name: "Technology", icon: "💻" },
    { id: "gaming", name: "Gaming", icon: "🎮" },
    { id: "lifestyle", name: "Lifestyle", icon: "🌟" },
    { id: "other", name: "Other", icon: "🎲" },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Try to fetch from API first
        try {
          const categoryParam =
            activeCategory !== "all" ? `&category=${activeCategory}` : "";
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout

          const response = await fetch(
            getApiUrl(`/posts?page=${page}&limit=20${categoryParam}`),
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);

          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              if (data.success) {
                if (page === 1) {
                  setPosts(data.data);
                } else {
                  setPosts((prevPosts) => [...prevPosts, ...data.data]);
                }
                setHasMore(page < data.pagination.pages);
                setLoading(false);
                return; // Success, exit early
              }
            }
          }
        } catch (apiError) {
          console.log("API not available, using mock data:", apiError.message);
        }

        // If API fails, use mock data
        const mockPosts = generateMockPosts(activeCategory, page);
        if (page === 1) {
          setPosts(mockPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...mockPosts]);
        }
        setHasMore(page < 3); // Mock 3 pages of data
      } catch (error) {
        console.error("Error in post loading process:", error);
        setError("Failed to load posts. Using mock data instead.");
        // Use mock data as fallback
        const mockPosts = generateMockPosts(activeCategory, 1);
        setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, activeCategory]);

  // Generate mock posts for demonstration
  const generateMockPosts = (category, pageNum) => {
    const mockAuthors = [
      "Anon_CoolStar123",
      "Anon_MysticWave456",
      "Anon_EpicMoon789",
      "Anon_CosmicVibe321",
      "Anon_WildSoul654",
      "Anon_FunkyMind987",
    ];

    const mockCategories = [
      "music",
      "art",
      "technology",
      "gaming",
      "lifestyle",
      "other",
    ];
    const selectedCategory =
      category === "all"
        ? mockCategories[Math.floor(Math.random() * mockCategories.length)]
        : category;

    return Array.from({ length: 6 }, (_, i) => ({
      _id: `mock-${Date.now()}-${pageNum}-${i}`,
      content: `This is a mock post ${
        i + 1
      } in the ${selectedCategory} category. It's a beautiful day to share something with the community! 🌟`,
      mediaUrl: null, // No media for mock posts initially
      mediaType: null,
      authorId: `mock-author-${i}`,
      authorName: mockAuthors[i % mockAuthors.length],
      category: selectedCategory,
      createdAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // Random time in last 7 days
      reactions: {
        beautiful: Math.floor(Math.random() * 10),
        deep: Math.floor(Math.random() * 5),
        report: 0,
      },
      reactedUsers: {},
    }));
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let onlineUsers = 0;
        try {
          const { webRTCApi } = await import("../services/api");
          const userStats = await webRTCApi.getUserStats();
          onlineUsers = userStats.onlineUsers || 0;
        } catch (apiError) {
          console.error("API error for online stats:", apiError);
          setError("Error fetching community stats. Please refresh the page.");
          return;
        }

        let todaysPosts = 0;
        if (posts.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          todaysPosts = posts.filter((post) => {
            const postDate = new Date(post.createdAt);
            return postDate >= today;
          }).length;
        }

        const uniqueAuthors = new Set();
        posts.forEach((post) => uniqueAuthors.add(post.authorId));

        setCommunityStats({
          activeMembers: uniqueAuthors.size,
          postsToday: todaysPosts,
          onlineNow: onlineUsers,
        });
      } catch (error) {
        console.error("Error generating community stats:", error);
        setError("Error fetching community stats. Please refresh the page.");
      }
    };

    fetchStats();
  }, [posts]);

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

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setPage(1);
    setSidebarOpen(false);
  };

  const togglePostForm = () => {
    setShowPostForm(!showPostForm);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile floating buttons */}
      <div className="fixed bottom-4 left-4 z-50 lg:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(true)}
          className="p-3 sm:p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-7 sm:w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </motion.button>
      </div>

      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePostForm}
          className="p-3 sm:p-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-2xl shadow-2xl transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-7 sm:w-7"
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

      <div className="flex min-h-screen max-w-7xl mx-auto">
        {/* Left Sidebar - Fixed */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`fixed top-0 left-0 z-40 h-screen w-64 sm:w-72 lg:w-80 bg-black/40 backdrop-blur-xl border-r border-white/10 transition-all duration-500 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 sm:p-6 h-full flex flex-col overflow-y-auto">
            {/* Logo */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <img
                    src={logoImage}
                    alt="Voodo"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                  Community
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-400 mb-3 sm:mb-4 uppercase tracking-wider px-3">
                Categories
              </h3>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full my-1 sm:my-2 flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl transition-all duration-300 text-sm sm:text-base ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-white shadow-lg border border-violet-500/30"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg sm:text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </motion.button>
              ))}
            </nav>

            {/* User Profile */}
            <div className="mt-auto">
              <div className="flex items-center space-x-3 p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 shadow-lg">
                  {anonymousName.substring(5, 7)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate text-sm sm:text-base">
                    {anonymousName}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm text-gray-400">Anonymous User</p>
                    {badgeData && <BadgeChip tier={badgeData.tier || (badgeData.name?.toLowerCase?.())} />}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetId}
                  className="p-2 text-gray-400 hover:text-violet-400 transition-colors rounded-full hover:bg-white/10"
                  title="Change Identity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 min-w-0 ml-0 lg:ml-80 xl:ml-80 overflow-y-auto h-screen">
          <div className="max-w-full sm:max-w-2xl mx-auto border-x border-white/10 bg-black/20 backdrop-blur-sm">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Home
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Latest posts from the community
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePostForm}
                  className="hidden lg:flex px-4 sm:px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Post
                </motion.button>
              </div>
            </div>

            {/* Post Form */}
            <AnimatePresence>
              {showPostForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 shadow-lg">
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Posts Feed */}
            <div className="divide-y divide-white/[0.08]">
              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 sm:p-8 text-center"
                >
                  <div className="text-5xl sm:text-6xl mb-4">😕</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">
                    Something went wrong
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                    {error}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setError(null);
                      setPage(1);
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-white font-semibold text-sm sm:text-base hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Try Again
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <PostGrid
                    posts={posts}
                    loading={loading && page === 1}
                    anonymousId={anonymousId}
                    onReaction={handlePostReaction}
                  />

                  {/* Load more */}
                  {posts.length > 0 && (
                    <div className="p-4 sm:p-6 border-t border-white/10">
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
                          className="w-full py-3 sm:py-4 text-violet-400 hover:bg-white/5 hover:text-white rounded-2xl transition-all duration-300 border border-white/10 hover:border-violet-500/30 font-medium text-sm sm:text-base"
                        >
                          Load More Posts
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-gray-400"
                        >
                          <div className="text-3xl sm:text-4xl mb-2">✨</div>
                          <p className="text-sm sm:text-base">
                            You've reached the end!
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {!loading && posts.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 sm:p-16 text-center"
                    >
                      <div className="text-5xl sm:text-6xl mb-4">✨</div>
                      <h3 className="text-lg sm:text-2xl font-semibold mb-2 text-white">
                        No posts yet
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
                        Be the first to share something with the community!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={togglePostForm}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-white font-semibold text-sm sm:text-base hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Create First Post
                      </motion.button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Scrollable */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden xl:block w-80 overflow-y-auto h-screen"
        >
          <div className="p-4 sm:p-6">
            {/* Trending */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-white/10 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
                Trending
              </h3>
              <div className="space-y-3">
                {categories.slice(1, 4).map((category) => {
                  const postsInCategory = posts.filter(
                    (post) => post.category === category.id
                  ).length;
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleCategoryChange(category.id)}
                      className="w-full text-left p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                          {category.icon}
                        </span>
                        <div>
                          <p className="font-semibold text-white text-sm sm:text-base">
                            {category.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">
                            {postsInCategory} posts
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-white/10 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
                Community Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm sm:text-base">
                    Active Members
                  </span>
                  <span className="font-semibold text-white text-sm sm:text-base">
                    {communityStats.activeMembers || "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm sm:text-base">
                    Posts Today
                  </span>
                  <span className="font-semibold text-white text-sm sm:text-base">
                    {communityStats.postsToday || "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm sm:text-base">
                    Online Now
                  </span>
                  <span className="font-semibold text-white text-sm sm:text-base">
                    {communityStats.onlineNow || "---"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-white/10">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={togglePostForm}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-white/10 rounded-2xl transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="font-medium text-white text-sm sm:text-base">
                    Create Post
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetId}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-white/10 rounded-2xl transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="font-medium text-white text-sm sm:text-base">
                    Change Identity
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityPage;
