"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink, LogOut } from "lucide-react"
import { walletManager } from "@/lib/cardano-wallet"

interface WalletInfoProps {
  walletName: string
  onDisconnect: () => void
}

export function WalletInfo({ walletName, onDisconnect }: WalletInfoProps) {
  const [balance, setBalance] = useState<string>("0.00")
  const [address, setAddress] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWalletInfo()
  }, [walletName])

  const loadWalletInfo = async () => {
    try {
      setLoading(true)
      const [walletBalance, walletAddress] = await Promise.all([walletManager.getBalance(), walletManager.getAddress()])
      setBalance(walletBalance)
      setAddress(walletAddress)
    } catch (error) {
      console.error("[v0] Failed to load wallet info:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      // Could add toast notification here
    } catch (error) {
      console.error("[v0] Failed to copy address:", error)
    }
  }

  const handleDisconnect = async () => {
    await walletManager.disconnectWallet()
    onDisconnect()
  }

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="font-medium">{walletName}</div>
              <Badge variant="secondary" className="text-xs">
                Connected
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDisconnect}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="font-mono font-medium">{balance} TRUTH</span>
          </div>

          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Address</span>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted p-2 rounded truncate">
                {address.slice(0, 20)}...{address.slice(-10)}
              </code>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={`https://cardanoscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={loadWalletInfo}>
          Refresh
        </Button>
      </div>
    </Card>
  )
}
