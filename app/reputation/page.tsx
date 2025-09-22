"use client"
import { ReputationDashboard } from "@/components/reputation-dashboard"
import { WalletConnection } from "@/components/wallet-connection"
import { useCardanoWallet } from "@/lib/cardano-wallet"

export default function ReputationPage() {
  const { isConnected, address } = useCardanoWallet()

  if (!isConnected || !address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Reputation Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Connect your Cardano wallet to view your reputation and token statistics.
          </p>
          <WalletConnection />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reputation Dashboard</h1>
        <p className="text-muted-foreground">
          Track your TRUTH token balance, voting accuracy, and platform reputation.
        </p>
      </div>

      <ReputationDashboard userAddress={address} />
    </div>
  )
}
