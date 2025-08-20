import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import BadgeChip from "../common/BadgeChip";

const PostItem = ({ post, anonymousId, onReaction, index = 0 }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // console.log("PostItem rendered with post:", post);

  if (!post) {  
    return (
      <div className="p-4 text-gray-500">
        <p>Post not found or has been deleted.</p>
      </div>
    );
  }

  const handleReaction = (reactionType) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const updatedPost = {
        ...post,
        reactions: {
          ...post.reactions,
          [reactionType]: (post.reactions[reactionType] || 0) + 1,
        },
        reactedUsers: {
          ...post.reactedUsers,
          [anonymousId]: reactionType,
        },
      };
      onReaction(post._id, updatedPost);
    } catch (error) {
      console.error("Error adding reaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const userReaction = post.reactedUsers?.[anonymousId] || null;
  console.log("timestamp:", post.createdAt);

  // Format the time since post creation
  const getFormattedTime = () => {
    if (!post.createdAt) return "Just now";
    
    const date = new Date(post.createdAt);
    if (isNaN(date.getTime())) {
      console.warn("Invalid timestamp:", post.createdAt);
      return "Just now";
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const formattedTime = getFormattedTime();

  // Better video detection logic
  const isVideo = () => {
    if (post.mediaType) {
      return post.mediaType.startsWith("video/");
    }
    if (post.mediaUrl) {
      const url = post.mediaUrl.toLowerCase();
      return (
        url.includes(".mp4") ||
        url.includes(".webm") ||
        url.includes(".mov") ||
        url.includes(".avi") ||
        url.includes(".wmv") ||
        url.includes(".ogg") ||
        url.includes(".3gp") ||
        url.includes(".3gpp") ||
        (url.includes("blob:") && post.mediaType?.startsWith("video/"))
      );
    }
    return false;
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <motion.div
      className="rounded-2xl bg-gray-800/70 backdrop-blur-sm shadow-lg border border-gray-700/50 overflow-hidden hover:border-violet-500/50 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      role="article"
      aria-labelledby={`post-${post._id}-title`}
    >
      {post.mediaUrl && !videoError && (
        <div className="w-full aspect-auto">
          {isVideo() ? (
            <div className="relative group">
              <video
                src={post.mediaUrl}
                controls
                autoPlay
                className="w-full h-auto object-cover rounded-t-2xl"
                aria-label="Post video"
                loading="lazy"
                preload="metadata"
                onError={handleVideoError}
                controlsList="nodownload"
                style={{ maxHeight: "400px" }}
              />
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                🎥 Video
              </div>
            </div>
          ) : (
            <img
              src={post.mediaUrl}
              alt="Post media"
              className="w-full h-auto object-cover rounded-t-2xl"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
                setVideoError(true);
              }}
            />
          )}
        </div>
      )}

      {videoError && (
        <div className="w-full h-32 bg-gray-700/50 rounded-t-2xl flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">🎥</div>
            <div className="text-sm">Video unavailable</div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {post.content && (
          <p
            id={`post-${post._id}-title`}
            className="text-gray-200 mb-4 whitespace-pre-wrap break-words text-sm sm:text-base"
          >
            {post.content}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-xs sm:text-sm">
            <span className="font-medium text-violet-400">
              {post.authorName}
            </span>
            <span className="mx-2">•</span>
            <span>{formattedTime}</span>
            {post.isPremiumPost && post.badgeType && (
              <>
                <span className="mx-2">•</span>
                <BadgeChip tier={post.badgeType} />
              </>
            )}
            {isVideo() && (
              <>
                <span className="mx-2">•</span>
                <span className="text-violet-400">🎥</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction("beautiful")}
              className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all text-xs sm:text-sm ${
                userReaction === "beautiful"
                  ? "bg-pink-500/30 text-pink-300"
                  : "hover:bg-gray-700/50 text-gray-400"
              }`}
              disabled={isSubmitting}
              aria-label="Beautiful reaction"
            >
              <span className="text-base">👍</span>
              {post.reactions?.beautiful > 0 && (
                <span>{post.reactions.beautiful}</span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction("deep")}
              className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all text-xs sm:text-sm ${
                userReaction === "deep"
                  ? "bg-blue-500/30 text-blue-300"
                  : "hover:bg-gray-700/50 text-gray-400"
              }`}
              disabled={isSubmitting}
              aria-label="Deep reaction"
            >
              <span className="text-base">👎</span>
              {post.reactions?.deep > 0 && <span>{post.reactions.deep}</span>}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction("report")}
              className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all text-xs sm:text-sm ${
                userReaction === "report"
                  ? "bg-red-500/30 text-red-300"
                  : "hover:bg-gray-700/50 text-gray-400"
              }`}
              disabled={isSubmitting}
              aria-label="Report post"
            >
              <span className="text-base">🚩</span>
              {post.reactions?.report > 0 && (
                <span>{post.reactions.report}</span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostItem;
