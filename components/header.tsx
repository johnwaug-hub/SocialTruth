"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletConnection } from "@/components/wallet-connection"
import { WalletInfo } from "@/components/wallet-info"
import { Wallet, HardHat, Home, Vote, Trophy, Building2, FileText, GitBranch } from "lucide-react"
import { walletManager } from "@/lib/cardano-wallet"
import Image from "next/image"

export function Header() {
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing connection on mount
    const checkConnection = async () => {
      if (walletManager.isConnected()) {
        setConnectedWallet(walletManager.getConnectedWalletName())
      } else {
        // Try to auto-reconnect
        const reconnected = await walletManager.autoReconnect()
        if (reconnected) {
          setConnectedWallet(walletManager.getConnectedWalletName())
        }
      }
    }

    checkConnection()
  }, [])

  const handleWalletConnect = (walletName: string) => {
    setConnectedWallet(walletName)
  }

  const handleWalletDisconnect = () => {
    setConnectedWallet(null)
  }

  const navLinks = [
    { href: "/voting", label: "Voting", icon: Vote },
    { href: "/validators", label: "Validators", icon: HardHat },
    { href: "/reputation", label: "Reputation", icon: Trophy },
  ]

  const governanceLinks = [
    { href: "/dao", label: "DAO", icon: Building2 },
    { href: "/whitepaper", label: "White Paper", icon: FileText },
    { href: "/workflow", label: "Workflow", icon: GitBranch },
  ]

  return (
    <>
      <header className="border-b bg-slate-900 border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/social-truth-app-icon.png"
                    alt="Social Truth Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">SOCIAL TRUTH</span>
                  <span className="text-xs text-yellow-400 font-medium">SUBMIT • VOTE • EARN REPUTATION</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                    pathname === "/"
                      ? "bg-yellow-400 text-slate-900 shadow-lg"
                      : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-600"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>

                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  )
                })}

                <div className="h-6 w-px bg-slate-600 mx-2" />

                {governanceLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="gap-2 bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700">
                <HardHat className="w-4 h-4" />
                1,247 Validators
              </Badge>

              {connectedWallet ? (
                <WalletInfo walletName={connectedWallet} onDisconnect={handleWalletDisconnect} />
              ) : (
                <Button
                  className="gap-2 bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-medium"
                  onClick={() => setWalletModalOpen(true)}
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <WalletConnection
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />
    </>
  )
}
