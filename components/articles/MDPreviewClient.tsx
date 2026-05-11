'use client'

import dynamic from 'next/dynamic'

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false })

export default function MDPreviewClient({ source, className }: { source: string, className?: string }) {
  return (
    <div className={className} data-color-mode="light">
      <MDPreview source={source} />
    </div>
  )
}
