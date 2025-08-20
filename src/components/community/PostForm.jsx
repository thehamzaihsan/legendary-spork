import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PostForm = ({ anonymousId, anonymousName, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaInfo, setMediaInfo] = useState(null);
  const [category, setCategory] = useState("other");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  const categories = [
    { id: "music", label: "Music" },
    { id: "art", label: "Art" },
    { id: "technology", label: "Technology" },
    { id: "gaming", label: "Gaming" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "other", label: "Other" },
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (error) setError("");
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setMedia(null);
      setMediaPreview(null);
      setMediaInfo(null);
      return;
    }

    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    const validVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
      "video/ogg",
      "video/3gpp",
      "video/3gpp2",
    ];

    const validTypes = [...validImageTypes, ...validVideoTypes];

    if (!validTypes.includes(file.type)) {
      setError(
        "Only JPEG, PNG, GIF, WEBP images or MP4, WebM, MOV, AVI, WMV, OGG, 3GP videos are allowed"
      );
      setMedia(null);
      setMediaPreview(null);
      setMediaInfo(null);
      return;
    }

    // Different size limits for images vs videos
    const isVideo = validVideoTypes.includes(file.type);
    const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for videos, 5MB  for images

    if (file.size > maxSize) {
      setError(
        isVideo
          ? "Video must be smaller than 10MB"
          : "Image must be smaller than 5MB"
      );
      setMedia(null);
      setMediaPreview(null);
      setMediaInfo(null);
      return;
    }

    setMediaInfo({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      isVideo: isVideo,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);

      // Get video duration if it's a video
      if (isVideo) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {

          const duration = video.duration;

          if (duration > 20) {
            setError("Video should be no longer than 20 seconds.");
            setMedia(null);
            setMediaPreview(null);
            setMediaInfo(null);
            return;
          }


          setMediaInfo((prev) => ({
            ...prev,
            duration: formatDuration(duration),
          }));

        };
        video.src = reader.result;
      }
    };
    setMedia(file);

    reader.readAsDataURL(file);
    if (error) setError("");
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) {
      setError("Please enter some text or add media");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Create FormData for proper file upload
      const formData = new FormData();

      // Add text fields
      formData.append("content", content.trim());
      formData.append("category", category);
      formData.append("authorId", anonymousId);
      formData.append("authorName", anonymousName);

      // Add media file if present
      if (media) {
        formData.append("media", media);
        formData.append("mediaType", media.type);
      }

      // Debug: Log what we're sending
      console.log("Sending FormData with:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        method: "POST",
        // Don't set Content-Type header - let browser set it with boundary for FormData
        body: formData,
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Response data:", responseData);

      // Reset form on success
      setContent("");
      setMedia(null);
      setMediaPreview(null);
      setMediaInfo(null);
      setCategory("other");
      if (fileInputRef.current) fileInputRef.current.value = "";

      setSuccessMessage("Post shared successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Call callback with the created post data
      if (onPostCreated && responseData) {
        console.log("Calling onPostCreated with:", responseData);
        onPostCreated(responseData.data);
      }

    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            placeholder="What's happening?"
            value={content}
            onChange={handleContentChange}
            className="w-full bg-transparent text-xl placeholder-gray-500 resize-none border-none outline-none min-h-[120px] text-white"
            maxLength={280}
            disabled={submitting}
            aria-label="Post content"
          />
          <div className="absolute bottom-0 right-0 text-sm text-gray-500">
            {content.length}/280
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="category" className="text-white">
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-800 text-white rounded px-3 py-2"
            disabled={submitting}
            aria-label="Post category"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {mediaPreview && (
          <div className="mb-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-1"
            >
              {mediaInfo?.isVideo ? (
                <div className="relative">
                  <video
                    src={mediaPreview}
                    controls
                    className="max-h-64 rounded mx-auto object-contain w-full"
                    aria-label="Video preview"
                    preload="metadata"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {mediaInfo.duration || "Loading..."}
                  </div>
                </div>
              ) : (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="max-h-64 rounded mx-auto object-contain"
                  loading="lazy"
                />
              )}

              {/* File info overlay */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {mediaInfo?.name} • {mediaInfo?.size}
              </div>

              <button
                type="button"
                onClick={handleRemoveMedia}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white border border-violet-500/30 transition-colors"
                aria-label="Remove media"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </motion.div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/ogg,video/3gpp,video/3gpp2"
              onChange={handleMediaChange}
              className="hidden"
              ref={fileInputRef}
              disabled={submitting}
              aria-label="Upload media"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-2 text-violet-400 hover:bg-violet-400/10 rounded-full transition-colors"
              disabled={submitting}
              aria-label="Add media"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>

            {/* Media type indicator */}
            {mediaInfo && (
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span className="text-lg">
                  {mediaInfo.isVideo ? "🎥" : "🖼️"}
                </span>
                <span>
                  {mediaInfo.isVideo ? "Video" : "Image"} • {mediaInfo.size}
                </span>
              </div>
            )}

            <motion.div
              className="text-xs text-gray-400"
              animate={{ opacity: anonymousName ? 1 : 0 }}
            >
              Posting as{" "}
              <span className="font-medium text-violet-400">
                {anonymousName}
              </span>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-full font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
            disabled={submitting || (!content.trim() && !media)}
            aria-label="Submit post"
          >
            {submitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Posting...</span>
              </div>
            ) : (
              "Post"
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="mt-4 p-3 bg-red-900/20 border border-red-500/20 text-red-400 rounded-lg text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              className="mt-4 p-3 bg-green-900/20 border border-green-500/20 text-green-400 rounded-lg text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default PostForm;