'use client'

interface ShareButtonsProps {
  title: string
  slug: string
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shares = [
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: 'f'
    },
    {
      name: 'Twitter / X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'bg-black hover:bg-gray-800',
      icon: 'X'
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-500 hover:bg-green-600',
      icon: 'W'
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-blue-700 hover:bg-blue-800',
      icon: 'in'
    },
  ]

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
        Partager cet article
      </p>
      <div className="flex gap-3 flex-wrap">
        {shares.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${s.color} text-white text-sm font-bold 
                       px-4 py-2 rounded-full transition-colors duration-200`}
          >
            {s.name}
          </a>
        ))}
      </div>
    </div>
  )
}
