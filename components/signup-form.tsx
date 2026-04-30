'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Loader2, Mail, Lock, User, CheckCircle, ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'
import { signUpWithEmail, loginWithGoogle, loginWithGithub } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    await signUpWithEmail(formData)
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    await loginWithGoogle()
    setIsGoogleLoading(false)
  }

  const handleGithubLogin = async () => {
    setIsGithubLoading(true)
    await loginWithGithub()
    setIsGithubLoading(false)
  }

  // Success: email verification pending
  if (message) {
    return (
      <div className={cn('flex flex-col gap-6 w-full', className)} {...props}>
        <Card className="border-0 shadow-2xl shadow-secondary/10" style={{ borderRadius: '12px' }}>
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #2D6A2D, #E8440A)' }} />
          <CardContent className="px-8 py-16 flex flex-col items-center text-center gap-6">
            <CheckCircle className="h-20 w-20" style={{ color: '#2D6A2D' }} />
            <div>
              <h2 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-display)', color: '#2D6A2D' }}>
                Vérifiez votre email
              </h2>
              <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-ui)', color: '#666666' }}>
                {decodeURIComponent(message)}
              </p>
            </div>
            <Link href="/auth/login">
              <Button className="mt-2 px-8 h-12" style={{ background: '#2D6A2D', fontFamily: 'var(--font-ui)', borderRadius: '4px' }}>
                Retour à la connexion
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6 w-full', className)} {...props}>
      <Card className="border-0 shadow-2xl shadow-secondary/10 overflow-hidden relative" style={{ borderRadius: '12px' }}>
        <CardHeader className="space-y-4 pt-10 pb-6 px-8 relative">
          <Link 
            href="/" 
            className="absolute left-4 top-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
            title="Retour à l'accueil"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="relative w-44 h-14">
              <Image src="/logo.png" alt="Yakanga" fill className="object-contain" />
            </div>
          </div>
          <div className="space-y-1 text-center">
            <CardTitle
              className="text-3xl"
              style={{ fontFamily: 'var(--font-display)', color: '#5C3A1E' }}
            >
              Rejoindre Yakanga
            </CardTitle>
            <CardDescription
              className="text-base"
              style={{ fontFamily: 'var(--font-ui)', color: '#666666' }}
            >
              La mémoire des cultures contemporaines
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-6 space-y-5">
          {/* Error message */}
          {error && (
            <div
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
              style={{ background: '#FEF2F2', borderLeft: '3px solid #CC2200', color: '#CC2200', fontFamily: 'var(--font-ui)' }}
            >
              <span>⚠️</span>
              <span>{decodeURIComponent(error)}</span>
            </div>
          )}

          {/* Signup form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, color: '#1A1A1A', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Nom complet
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#666666' }} />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Jean-Baptiste Mokoena"
                  required
                  autoComplete="name"
                  className="pl-10 h-12 focus-visible:ring-1"
                  style={{ fontFamily: 'var(--font-ui)', borderColor: '#E0E0E0' } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, color: '#1A1A1A', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Adresse email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#666666' }} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  autoComplete="email"
                  className="pl-10 h-12 focus-visible:ring-1"
                  style={{ fontFamily: 'var(--font-ui)', borderColor: '#E0E0E0' } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, color: '#1A1A1A', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#666666' }} />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 caractères"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="pl-10 h-12 focus-visible:ring-1"
                  style={{ fontFamily: 'var(--font-ui)', borderColor: '#E0E0E0' } as React.CSSProperties}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-12 text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#E8440A', fontFamily: 'var(--font-ui)', borderRadius: '4px' }}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création du compte…</>
              ) : (
                'CRÉER MON COMPTE'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: '#E0E0E0' }} />
            <span className="text-xs" style={{ fontFamily: 'var(--font-ui)', color: '#666666' }}>OU CONTINUER AVEC</span>
            <div className="flex-1 h-px" style={{ background: '#E0E0E0' }} />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading || isGithubLoading}
              className="h-12 gap-3 transition-all hover:bg-gray-50 active:scale-[0.98]"
              style={{ borderColor: '#E0E0E0', fontFamily: 'var(--font-ui)', fontWeight: 600, color: '#1A1A1A', borderRadius: '4px' }}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              <span className="hidden sm:inline">Google</span>
            </Button>

            {/* GitHub */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGithubLogin}
              disabled={isLoading || isGoogleLoading || isGithubLoading}
              className="h-12 gap-3 transition-all hover:bg-gray-50 active:scale-[0.98]"
              style={{ borderColor: '#E0E0E0', fontFamily: 'var(--font-ui)', fontWeight: 600, color: '#1A1A1A', borderRadius: '4px' }}
            >
              {isGithubLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <div className="relative h-5 w-5">
                  <Image src="/social/github.png" alt="GitHub" fill className="object-contain" />
                </div>
              )}
              <span className="hidden sm:inline">GitHub</span>
            </Button>
          </div>

          {/* Terms */}
          <p className="text-center text-xs leading-relaxed" style={{ fontFamily: 'var(--font-ui)', color: '#999999' }}>
            En créant un compte, vous acceptez nos{' '}
            <Link href="/mentions-legales" className="underline hover:text-primary">conditions d'utilisation</Link>
            {' '}et notre{' '}
            <Link href="/mentions-legales" className="underline hover:text-primary">politique de confidentialité</Link>.
          </p>
        </CardContent>

        <CardFooter className="px-8 pb-10 flex justify-center">
          <p className="text-sm" style={{ fontFamily: 'var(--font-ui)', color: '#666666' }}>
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="font-semibold transition-colors hover:underline" style={{ color: '#2D6A2D' }}>
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
