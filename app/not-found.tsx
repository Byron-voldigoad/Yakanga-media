import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center 
                    justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-green-700 mb-4">
        404
      </h1>
      <p className="text-2xl font-semibold text-gray-800 mb-2">
        Page introuvable
      </p>
      <p className="text-gray-500 mb-8 max-w-md">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link 
        href="/"
        className="bg-green-700 text-white px-6 py-3 
                   rounded-full font-semibold hover:bg-green-800 
                   transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
