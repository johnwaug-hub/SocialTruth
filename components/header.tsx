"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WalletConnection } from "@/components/wallet-connection"
import { WalletInfo } from "@/components/wallet-info"
import { Wallet, Shield, Users, Home, Vote, Trophy, ChevronDown, Building2, FileText, GitBranch } from "lucide-react"
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
    { href: "/validators", label: "Validators", icon: Shield },
    { href: "/reputation", label: "Reputation", icon: Trophy },
  ]

  const governanceLinks = [
    { href: "/dao", label: "DAO Governance", icon: Building2 },
    { href: "/whitepaper", label: "White Paper", icon: FileText },
    { href: "/workflow", label: "Workflow", icon: GitBranch },
  ]

  return (
    <>
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Social Truth DAO</span>
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
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${
                        governanceLinks.some((link) => pathname === link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Governance
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {governanceLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <DropdownMenuItem key={link.href} asChild>
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
              <Badge variant="secondary" className="gap-2">
                <Users className="w-4 h-4" />
                1,247 Validators
              </Badge>

              {connectedWallet ? (
                <WalletInfo walletName={connectedWallet} onDisconnect={handleWalletDisconnect} />
              ) : (
                <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setWalletModalOpen(true)}>
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
