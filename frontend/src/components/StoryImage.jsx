import React, { useState } from "react";

function getUniqueFallbackCover(alt) {
  const title = alt || "Webtoon Story";
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
  }
  const seed = Math.abs(hash % 1000000);
  const prompt = `masterpiece Korean manhwa anime webtoon poster cover art, ${title}, dynamic cinematic lighting, vivid colors, 8k`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=768&nologo=true&seed=${seed}`;
}

export default function StoryImage({ src, alt, style, className, fallback }) {
  const [error, setError] = useState(false);

  const dynamicFallback = fallback || getUniqueFallbackCover(alt);
  const rawSrc = src && src.includes("/src/assets/") ? src.replace("/src/assets/", "/covers/") : src;
  const finalSrc = error || !rawSrc || rawSrc === "📖" || rawSrc === "✨" ? dynamicFallback : rawSrc;
  const isUrl = typeof finalSrc === 'string' && (finalSrc.startsWith("http") || finalSrc.startsWith("/"));

  if (!isUrl) {
    return (
      <div style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center" }} className={className}>
        {finalSrc || "📖"}
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt || "Webtoon"}
      style={{ ...style, objectFit: "cover" }}
      className={className}
      onError={() => setError(true)}
    />
  );
}
