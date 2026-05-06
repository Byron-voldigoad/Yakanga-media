'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, FileText, LayoutDashboard, Megaphone, PlusCircle } from 'lucide-react'

type Props = { fullName: string; role: string }

const navItems = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/articles/new', label: 'Nouvel article', icon: PlusCircle, exact: true },
  { href: '/admin/articles', label: 'Articles', icon: FileText, exact: false },
  { href: '/admin/sponsors', label: 'Publicité', icon: Megaphone, exact: false },
]

export default function AdminSidebar({ fullName, role }: Props) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-[#1A1A1A] fixed h-full flex flex-col z-10 border-r border-white/5 shadow-2xl">
      {/* Logo Area */}
      <div className="px-8 pt-10 pb-8">
        <Link href="/" className="block mb-10 transition-transform hover:scale-105">
          <div className="relative w-full h-12">
            <Image
              src="/logo.png"
              alt="Yakanga Logo"
              fill
              className="object-contain object-left brightness-0 invert"
            />
          </div>
        </Link>
        <div className="bg-white/5 rounded-xl px-3 py-2.5">
          <p className="text-white text-xs font-semibold truncate">{fullName}</p>
          <p className="text-white/30 text-xs mt-0.5 capitalize">{role}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="text-white/20 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">Navigation</p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-[#2D6A2D] text-white font-medium shadow-lg shadow-green-900/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}>
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 space-y-0.5 border-t border-white/5 pt-4">
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft size={15} />
          Retour au site
        </Link>
      </div>
    </aside>
  )
}
