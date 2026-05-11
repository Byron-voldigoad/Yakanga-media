interface YouTubeEmbedProps {
  url: string
}

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  // Extraire l'ID depuis les formats :
  // https://www.youtube.com/watch?v=ID
  // https://youtu.be/ID
  const getYouTubeId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    )
    return match ? match[1] : null
  }

  const videoId = getYouTubeId(url)
  if (!videoId) return null

  return (
    <div className="my-6 rounded-xl overflow-hidden shadow-md aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Vidéo YouTube"
        allow="accelerometer; autoplay; clipboard-write; 
               encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}
