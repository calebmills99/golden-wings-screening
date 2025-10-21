# Video Assets

## Adding Your Aerial Clouds Video

1. **Place your video file here** with the name: `clouds-aerial.mp4`
2. **Create a poster image** (screenshot from video): `poster.jpg`

## Video Optimization Tips

**Recommended specs for web:**
- Format: MP4 (H.264 codec) or WebM
- Resolution: 1920x1080 (1080p max, 720p for smaller file size)
- Frame rate: 24-30 fps
- File size: Under 5MB ideally (compress if needed)
- Length: 10-20 seconds on loop looks seamless

**Compression tools:**
```bash
# Using ffmpeg to compress and optimize:
ffmpeg -i your-video.mp4 -c:v libx264 -crf 28 -preset slow -vf scale=1920:1080 -an clouds-aerial.mp4

# Create WebM version for better compression:
ffmpeg -i clouds-aerial.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 clouds-aerial.webm

# Extract poster image:
ffmpeg -i clouds-aerial.mp4 -ss 00:00:02 -vframes 1 poster.jpg
```

**Online tools (no install needed):**
- https://www.freeconvert.com/video-compressor
- https://cloudconvert.com/mp4-converter

## File Structure

```
src/videos/
├── clouds-aerial.mp4   ← Your main video (MP4 format)
├── clouds-aerial.webm  ← Optional: WebM for better compression
└── poster.jpg          ← Poster image (shown while video loads)
```

## Performance Notes

- Video is hidden on mobile devices (under 768px width) to save bandwidth
- Falls back to blue gradient on mobile
- Video autoplays muted (required for autoplay to work)
- `playsinline` attribute prevents fullscreen on iOS

## Current Implementation

The video is set to:
- ✅ Autoplay on loop
- ✅ Muted (required for autoplay)
- ✅ Covers full hero section
- ✅ 40% dark overlay for text readability
- ✅ Smooth fade-in animation
- ✅ Mobile-optimized (video disabled on small screens)
