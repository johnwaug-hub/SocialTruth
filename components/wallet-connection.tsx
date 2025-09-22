"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import { walletManager, type CardanoWallet } from "@/lib/cardano-wallet"

interface WalletConnectionProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (walletName: string) => void
}

export function WalletConnection({ isOpen, onClose, onConnect }: WalletConnectionProps) {
  const [availableWallets, setAvailableWallets] = useState<CardanoWallet[]>([])
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      const wallets = walletManager.getAvailableWallets()
      setAvailableWallets(wallets)
    }
  }, [isOpen])

  const handleConnect = async (walletName: string) => {
    setConnecting(walletName)
    try {
      const success = await walletManager.connectWallet(walletName)
      if (success) {
        onConnect(walletName)
        onClose()
      }
    } catch (error) {
      console.error("[v0] Connection failed:", error)
    } finally {
      setConnecting(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Cardano Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {availableWallets.length === 0 ? (
            <Card className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No Wallets Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please install a Cardano wallet extension to continue.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent" asChild>
                  <a href="https://namiwallet.io" target="_blank" rel="noopener noreferrer">
                    Install Nami Wallet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent" asChild>
                  <a href="https://eternl.io" target="_blank" rel="noopener noreferrer">
                    Install Eternl Wallet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Choose a wallet to connect:</p>
              {availableWallets.map((wallet) => (
                <Card
                  key={wallet.name}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleConnect(wallet.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <div className="font-medium">{wallet.name}</div>
                        <div className="text-xs text-muted-foreground">API v{wallet.apiVersion}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Available
                      </Badge>
                      {connecting === wallet.name ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Your wallet will be used to sign transactions and stake TRUTH tokens for voting. We never store your
              private keys.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
