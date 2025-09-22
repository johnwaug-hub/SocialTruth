"use client"

import { useState, useEffect } from "react"

// Cardano wallet integration utilities
export interface CardanoWallet {
  name: string
  icon: string
  apiVersion: string
  enable(): Promise<CardanoApi>
  isEnabled(): Promise<boolean>
}

export interface CardanoApi {
  getBalance(): Promise<string>
  getUsedAddresses(): Promise<string[]>
  getUnusedAddresses(): Promise<string[]>
  getChangeAddress(): Promise<string>
  getRewardAddresses(): Promise<string[]>
  signTx(tx: string, partialSign?: boolean): Promise<string>
  signData(address: string, payload: string): Promise<{ signature: string; key: string }>
  submitTx(tx: string): Promise<string>
  getCollateral(): Promise<string[]>
  experimental: {
    getCollateral(): Promise<string[]>
    on(eventType: string, callback: Function): void
    off(eventType: string, callback: Function): void
  }
}

declare global {
  interface Window {
    cardano?: {
      nami?: CardanoWallet
      eternl?: CardanoWallet
      flint?: CardanoWallet
      typhon?: CardanoWallet
      yoroi?: CardanoWallet
      gerowallet?: CardanoWallet
      [key: string]: CardanoWallet | undefined
    }
  }
}

export class CardanoWalletManager {
  private static instance: CardanoWalletManager
  private connectedWallet: CardanoApi | null = null
  private walletName: string | null = null

  static getInstance(): CardanoWalletManager {
    if (!CardanoWalletManager.instance) {
      CardanoWalletManager.instance = new CardanoWalletManager()
    }
    return CardanoWalletManager.instance
  }

  getAvailableWallets(): CardanoWallet[] {
    if (typeof window === "undefined" || !window.cardano) return []

    const wallets: CardanoWallet[] = []
    const cardano = window.cardano

    // Check for popular Cardano wallets
    if (cardano.nami) wallets.push({ ...cardano.nami, name: "Nami", icon: "🦎" })
    if (cardano.eternl) wallets.push({ ...cardano.eternl, name: "Eternl", icon: "♾️" })
    if (cardano.flint) wallets.push({ ...cardano.flint, name: "Flint", icon: "🔥" })
    if (cardano.typhon) wallets.push({ ...cardano.typhon, name: "Typhon", icon: "🌊" })
    if (cardano.yoroi) wallets.push({ ...cardano.yoroi, name: "Yoroi", icon: "🏛️" })
    if (cardano.gerowallet) wallets.push({ ...cardano.gerowallet, name: "Gero", icon: "⚡" })

    return wallets
  }

  async connectWallet(walletName: string): Promise<boolean> {
    try {
      const wallets = this.getAvailableWallets()
      const wallet = wallets.find((w) => w.name.toLowerCase() === walletName.toLowerCase())

      if (!wallet) {
        throw new Error(`Wallet ${walletName} not found`)
      }

      const api = await wallet.enable()
      this.connectedWallet = api
      this.walletName = walletName

      // Store connection in localStorage
      localStorage.setItem("connectedWallet", walletName)

      return true
    } catch (error) {
      console.error("[v0] Wallet connection failed:", error)
      return false
    }
  }

  async disconnectWallet(): Promise<void> {
    this.connectedWallet = null
    this.walletName = null
    localStorage.removeItem("connectedWallet")
  }

  async getBalance(): Promise<string> {
    if (!this.connectedWallet) throw new Error("No wallet connected")

    try {
      const balance = await this.connectedWallet.getBalance()
      // Convert from lovelace to TRUTH tokens (1 TRUTH = 1,000,000 lovelace equivalent)
      const balanceInTruth = Number.parseInt(balance) / 1000000
      return balanceInTruth.toFixed(2)
    } catch (error) {
      console.error("[v0] Failed to get balance:", error)
      return "0.00"
    }
  }

  async getAddress(): Promise<string> {
    if (!this.connectedWallet) throw new Error("No wallet connected")

    try {
      const addresses = await this.connectedWallet.getUsedAddresses()
      return addresses[0] || ""
    } catch (error) {
      console.error("[v0] Failed to get address:", error)
      return ""
    }
  }

  async signTransaction(txHex: string): Promise<string> {
    if (!this.connectedWallet) throw new Error("No wallet connected")

    try {
      const signedTx = await this.connectedWallet.signTx(txHex, false)
      return signedTx
    } catch (error) {
      console.error("[v0] Transaction signing failed:", error)
      throw error
    }
  }

  async submitTransaction(signedTxHex: string): Promise<string> {
    if (!this.connectedWallet) throw new Error("No wallet connected")

    try {
      const txHash = await this.connectedWallet.submitTx(signedTxHex)
      return txHash
    } catch (error) {
      console.error("[v0] Transaction submission failed:", error)
      throw error
    }
  }

  isConnected(): boolean {
    return this.connectedWallet !== null
  }

  getConnectedWalletName(): string | null {
    return this.walletName
  }

  // Auto-reconnect on page load
  async autoReconnect(): Promise<boolean> {
    const savedWallet = localStorage.getItem("connectedWallet")
    if (savedWallet) {
      return await this.connectWallet(savedWallet)
    }
    return false
  }
}

export const walletManager = CardanoWalletManager.getInstance()

export function useCardanoWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0.00")
  const [walletName, setWalletName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeWallet = async () => {
      setIsLoading(true)

      // Check if wallet is already connected
      if (walletManager.isConnected()) {
        setIsConnected(true)
        setWalletName(walletManager.getConnectedWalletName())

        try {
          const walletAddress = await walletManager.getAddress()
          const walletBalance = await walletManager.getBalance()
          setAddress(walletAddress)
          setBalance(walletBalance)
        } catch (error) {
          console.error("[v0] Failed to get wallet info:", error)
        }
      } else {
        // Try to auto-reconnect
        const reconnected = await walletManager.autoReconnect()
        if (reconnected) {
          setIsConnected(true)
          setWalletName(walletManager.getConnectedWalletName())

          try {
            const walletAddress = await walletManager.getAddress()
            const walletBalance = await walletManager.getBalance()
            setAddress(walletAddress)
            setBalance(walletBalance)
          } catch (error) {
            console.error("[v0] Failed to get wallet info after reconnect:", error)
          }
        }
      }

      setIsLoading(false)
    }

    initializeWallet()
  }, [])

  const connectWallet = async (walletName: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const success = await walletManager.connectWallet(walletName)

      if (success) {
        setIsConnected(true)
        setWalletName(walletName)

        const walletAddress = await walletManager.getAddress()
        const walletBalance = await walletManager.getBalance()
        setAddress(walletAddress)
        setBalance(walletBalance)
      }

      setIsLoading(false)
      return success
    } catch (error) {
      console.error("[v0] Wallet connection failed:", error)
      setIsLoading(false)
      return false
    }
  }

  const disconnectWallet = async () => {
    await walletManager.disconnectWallet()
    setIsConnected(false)
    setAddress(null)
    setBalance("0.00")
    setWalletName(null)
  }

  const refreshBalance = async () => {
    if (isConnected) {
      try {
        const newBalance = await walletManager.getBalance()
        setBalance(newBalance)
      } catch (error) {
        console.error("[v0] Failed to refresh balance:", error)
      }
    }
  }

  return {
    isConnected,
    address,
    balance,
    walletName,
    isLoading,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    walletManager,
  }
}
