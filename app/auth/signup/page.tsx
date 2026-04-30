import { Suspense } from 'react'
import Image from 'next/image'
import { SignupForm } from '@/components/signup-form'

export const metadata = {
  title: 'Créer un compte — Yakanga',
  description: 'Rejoignez la communauté Yakanga Web Média.',
}

export default function SignupPage() {
  return (
    <main className="flex min-h-svh w-full bg-[#F5F0C8] overflow-hidden">
      {/* Left side: Form */}
      <div className="relative flex flex-1 items-center justify-center p-6 md:p-10">
        {/* Background decorative blobs */}
        <div
          className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
          style={{ background: '#E8440A' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-[400px] w-[400px] rounded-full opacity-25 blur-3xl"
          style={{ background: '#2D6A2D' }}
        />
        
        <div className="relative z-10 w-full max-w-md">
          <Suspense>
            <SignupForm />
          </Suspense>
        </div>
      </div>

      {/* Right side: Image (Visible on LG screens) */}
      <div className="hidden lg:flex flex-1 relative bg-secondary overflow-hidden">
        <Image
          src="/assets/img1.png"
          alt="Yakanga Auth Illustration"
          fill
          className="object-cover opacity-90 brightness-[0.8] contrast-[1.1] scale-x-[-1]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/60" />
        <div className="absolute bottom-16 left-16 right-16 text-white space-y-4">
          <h2 className="font-display text-6xl leading-tight">Rejoignez l'aventure culturelle</h2>
          <div className="h-1 w-24 bg-primary" />
          <p className="font-body text-xl opacity-90 italic max-w-lg">
            "Archivez le présent pour éclairer l'avenir avec Yakanga Web Média."
          </p>
        </div>
      </div>
    </main>
  )
}
