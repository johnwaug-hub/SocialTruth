"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WalletConnection } from "@/components/wallet-connection"
import { WalletInfo } from "@/components/wallet-info"
import { Wallet, Users, Home, Vote, Trophy, ChevronDown, Building2, FileText, GitBranch } from "lucide-react"
import { walletManager } from "@/lib/cardano-wallet"

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
    { href: "/", label: "Home", icon: Home },
    { href: "/voting", label: "Voting", icon: Vote },
    { href: "/validators", label: "Validators", icon: Trophy },
    { href: "/reputation", label: "Reputation", icon: Trophy },
  ]

  const governanceLinks = [
    { href: "/dao", label: "DAO Governance", icon: Building2 },
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
                <div className="relative w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-0.5">
                  <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Balance scale symbol */}
                    <div className="text-white text-xs font-bold">
                      <div className="flex flex-col items-center">
                        {/* Radiating lines */}
                        <div className="flex gap-0.5 mb-1">
                          <div className="w-0.5 h-1 bg-white rotate-45"></div>
                          <div className="w-0.5 h-1.5 bg-white"></div>
                          <div className="w-0.5 h-1 bg-white -rotate-45"></div>
                        </div>
                        {/* Balance scale */}
                        <div className="flex items-center text-[6px]">
                          <span>R</span>
                          <div className="mx-1 w-2 h-0.5 bg-white relative">
                            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-white"></div>
                          </div>
                          <span>M</span>
                        </div>
                        {/* Cardano dots */}
                        <div className="flex gap-0.5 mt-0.5">
                          <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">SOCIAL TRUTH</span>
                  <span className="text-xs text-yellow-400 font-medium">SUBMIT • VOTE • EARN REPUTATION</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-slate-800 ${
                        governanceLinks.some((link) => pathname === link.href)
                          ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Governance
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-slate-800 border-slate-700">
                    {governanceLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <DropdownMenuItem
                          key={link.href}
                          asChild
                          className="text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Link href={link.href} className="flex items-center gap-2 w-full">
                            <Icon className="w-4 h-4" />
                            {link.label}
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="gap-2 bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700">
                <Users className="w-4 h-4" />
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
