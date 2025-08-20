# Video Upload Functionality Test Guide

## Overview

The Voodo Desktop application now supports comprehensive video upload functionality alongside image uploads. Users can upload videos in various formats and share them in community posts.

## Supported Video Formats

- **MP4** (.mp4) - Most common format
- **WebM** (.webm) - Web-optimized format
- **MOV** (.mov) - Apple QuickTime format
- **AVI** (.avi) - Windows video format
- **WMV** (.wmv) - Windows Media format
- **OGG** (.ogg) - Open source format
- **3GP** (.3gp, .3gpp) - Mobile video format

## File Size Limits

- **Videos**: Up to 50MB
- **Images**: Up to 10MB

## Features Implemented

### 1. Enhanced PostForm Component

- ✅ Video file validation with MIME type checking
- ✅ File size validation (different limits for videos vs images)
- ✅ Video preview with duration display
- ✅ File information overlay (name, size, type)
- ✅ Media type indicator (🎥 for videos, 🖼️ for images)
- ✅ Support for multiple video formats
- ✅ Better error messages for unsupported formats

### 2. Improved PostItem Component

- ✅ Better video detection logic
- ✅ Enhanced video rendering with controls
- ✅ Video error handling with fallback display
- ✅ Video indicator in post metadata
- ✅ Responsive video sizing
- ✅ Video hover effects

### 3. Enhanced PostGrid Component

- ✅ Video post counter
- ✅ Visual indicators for video content
- ✅ Better categorization of video posts

## How to Test

### 1. Upload a Video

1. Navigate to the Community page
2. Click the "Post" button to open the post form
3. Click the media upload button (📷 icon)
4. Select a video file from your device
5. Verify the video preview appears with:
   - Video controls
   - Duration display (top-left)
   - File info overlay (bottom-left)
   - Media type indicator (🎥 Video)
6. Add some text content
7. Select a category
8. Click "Post" to submit

### 2. View Video Posts

1. After posting, the video should appear in the feed
2. Verify the video plays correctly with controls
3. Check that the video indicator (🎥) appears in the post metadata
4. Test video reactions (🌈, 💭, ❗)

### 3. Test Different Video Formats

Try uploading videos in different formats:

- MP4 files (most common)
- WebM files (web-optimized)
- MOV files (from iPhone/QuickTime)
- AVI files (Windows format)

### 4. Test File Size Limits

- Try uploading a video larger than 50MB (should show error)
- Try uploading an image larger than 10MB (should show error)
- Verify appropriate error messages appear

### 5. Test Video Error Handling

- Try uploading a corrupted video file
- Verify the error fallback displays correctly
- Check that the "Video unavailable" message appears

## Technical Implementation Details

### Video Detection Logic

The application uses multiple methods to detect video files:

1. **MIME Type Check**: `post.mediaType?.startsWith('video/')`
2. **File Extension Check**: Checks for common video extensions
3. **Blob URL Check**: For files uploaded via `URL.createObjectURL()`

### Video Preview Features

- **Duration Display**: Shows video length in MM:SS format
- **File Information**: Displays filename and size
- **Media Type Indicator**: Visual indicator for video vs image
- **Responsive Design**: Videos adapt to different screen sizes

### Error Handling

- **Format Validation**: Checks for supported video formats
- **Size Validation**: Enforces file size limits
- **Playback Errors**: Handles video loading failures
- **User Feedback**: Clear error messages for various scenarios

## Browser Compatibility

The video upload functionality works in all modern browsers that support:

- HTML5 video element
- File API
- FileReader API
- URL.createObjectURL()

## Performance Considerations

- Videos are preloaded with `preload="metadata"` for better performance
- File size limits prevent excessive memory usage
- Video controls include `controlsList="nodownload"` for security
- Lazy loading is implemented for better page performance

## Future Enhancements

Potential improvements for future versions:

- Video compression before upload
- Thumbnail generation for videos
- Video streaming for large files
- Video editing capabilities
- Video quality selection options
