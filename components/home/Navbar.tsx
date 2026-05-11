"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X, LogOut, User as UserIcon, LogIn, PlusCircle, ChevronDown } from "lucide-react";
import CreatePostModal from "@/components/modals/CreatePostModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/client";
import { logout } from "@/app/auth/actions";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CATEGORIES } from "@/lib/constants";

const logos = [
  { src: '/logo-noir.png',    filter: '' },
  { src: '/logo-couleur.png', filter: '' },
  { src: '/logo-vert.png',    filter: 'brightness(0) saturate(100%) invert(22%) sepia(60%) saturate(600%) hue-rotate(95deg) brightness(85%)' },
]

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileRubriquesOpen, setIsMobileRubriquesOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const getUserData = async (user: User | null) => {
      if (!user) {
        setRole(null);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setRole(profile?.role ?? "reader");
    };

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      getUserData(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      getUserData(currentUser);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogo((prev) => (prev + 1) % logos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="relative h-14 w-44">
              {logos.map((logo, index) => (
                <Image
                  key={logo.src}
                  src={logo.src}
                  alt="Yakanga"
                  fill
                  className={`object-contain transition-opacity duration-700
                              ${index === currentLogo
                                ? 'opacity-100'
                                : 'opacity-0'}`}
                  style={{ filter: logo.filter }}
                />
              ))}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="font-ui text-[15px] font-medium text-text hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Accueil
            </Link>

            {/* DESKTOP — Méga-menu */}
            <div 
              className="relative h-20 flex items-center"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="flex items-center gap-1 font-ui text-[15px] font-medium text-text hover:text-primary transition-colors">
                Rubriques
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMegaMenuOpen && (
                <>
                  {/* Overlay */}
                  <div className="fixed inset-0 top-20 bg-black/10 z-40" />

                  {/* Méga-menu */}
                  <div className="fixed left-0 right-0 top-20 bg-white shadow-xl border-t-2 border-primary z-50">
                    <div className="max-w-7xl mx-auto px-8 py-5">
                      
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                        Nos rubriques
                      </p>

                      <div className="grid grid-cols-5 gap-2">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/${cat.slug}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium text-gray-700"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {cat.name}
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400 italic">
                          La mémoire des cultures contemporaines
                        </p>
                        <Link 
                          href="/"
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Voir tous les articles →
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <a
              href="mailto:ulrichenyegue17@gmail.com"
              className="font-ui text-[15px] font-medium text-text hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-[150px] lg:w-[250px] pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full transition-all focus:w-[300px]"
            />
          </div>
          {user && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent hover:bg-accent/90 text-white font-ui font-semibold gap-2 hidden lg:flex shadow-lg shadow-accent/20"
            >
              <PlusCircle className="h-4 w-4" />
              Créer
            </Button>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.user_metadata?.full_name?.charAt(0) ?? user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name ?? "Utilisateur"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {role && ["admin", "editor"].includes(role) && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer text-primary font-semibold">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Administration</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="hidden sm:flex font-ui font-semibold text-primary hover:text-primary hover:bg-primary/5">
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-primary hover:bg-primary/90 text-white font-ui font-semibold px-6 shadow-lg shadow-primary/20">
                  S'abonner
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-white animate-in slide-in-from-top duration-200">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-sm font-ui font-medium text-text hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
            >
              Accueil
            </Link>

            {/* Rubriques collapsible */}
            <div>
              <button
                onClick={() => setIsMobileRubriquesOpen(!isMobileRubriquesOpen)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-ui font-medium text-text hover:bg-gray-50 rounded-lg transition-colors"
              >
                Rubriques
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileRubriquesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileRubriquesOpen && (
                <div className="pl-4 space-y-0.5">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-sm font-ui text-muted-foreground hover:bg-gray-50 hover:text-green-700 rounded-lg transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href="mailto:ulrichenyegue17@gmail.com"
              className="block px-4 py-3 text-sm font-ui font-medium text-text hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      )}

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
