import React, { useState } from "react";
import { motion } from "framer-motion";
import PostItem from "./PostItem";

const PostGrid = ({ posts, loading, anonymousId, onReaction }) => {
  const categories = [
    { id: "all", label: "All" },
    { id: "music", label: "Music" },
    { id: "art", label: "Art" },
    { id: "technology", label: "Technology" },
    { id: "gaming", label: "Gaming" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "other", label: "Other" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  // Count video posts for display
  const videoPostCount = filteredPosts.filter(
    (post) =>
      post.mediaType?.startsWith("video/") ||
      (post.mediaUrl &&
        (post.mediaUrl.includes(".mp4") ||
          post.mediaUrl.includes(".webm") ||
          post.mediaUrl.includes(".mov") ||
          post.mediaUrl.includes(".avi") ||
          post.mediaUrl.includes(".wmv") ||
          post.mediaUrl.includes(".ogg") ||
          post.mediaUrl.includes(".3gp") ||
          post.mediaUrl.includes(".3gpp")))
  ).length;

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6">
      {Array(6)
        .fill()
        .map((_, i) => (
          <motion.div
            key={i}
            className="rounded-2xl bg-gray-800/60 shadow-lg border border-gray-700/50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <div className="p-4 sm:p-5 space-y-3">
              <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse"></div>
              <div className="h-48 bg-gray-700/30 rounded animate-pulse"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-700/40 rounded w-1/4 animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-gray-700/40 rounded-full animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-700/40 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
    </div>
  );

  return (
    <div className="space-y-6 pt-5">
      <div className="flex flex-wrap justify-center gap-2 px-4 sm:px-6">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? "bg-violet-600 text-white shadow-md"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
            }`}
            aria-label={`Filter by ${cat.label}`}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Video post count indicator */}
      {videoPostCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4 sm:px-6"
        >
          <div className="inline-flex items-center space-x-2 bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-sm">
            <span>🎥</span>
            <span>
              {videoPostCount} video{videoPostCount !== 1 ? "s" : ""} in this
              category
            </span>
          </div>
        </motion.div>
      )}

      {loading ? (
        renderLoadingSkeleton()
      ) : (
        <div className="columns-1 gap-4 sm:gap-6 px-4 sm:px-6 [column-fill:_balance]">
          {filteredPosts.map((post, index) => (
            <div key={post._id} className="break-inside-avoid mb-4 sm:mb-6">
              <PostItem
                post={post}
                anonymousId={anonymousId}
                onReaction={onReaction}
                index={index}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostGrid;
