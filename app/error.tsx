'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erreur capturée par boundary:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="bg-red-50 p-4 rounded-full">
        <AlertTriangle className="h-12 w-12 text-red-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Oups ! Quelque chose s'est mal passé.</h2>
        <p className="text-muted-foreground max-w-md">
          Une erreur inattendue est survenue. Nous nous excusons pour le dérangement.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">
          Réessayer
        </Button>
        <Button onClick={() => window.location.href = '/'}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  )
}
