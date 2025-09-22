import { VotingHistory } from "@/components/voting-history"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function VotingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Voting Dashboard</h1>
              <p className="text-muted-foreground">Track your voting history, rewards, and accuracy metrics</p>
            </div>

            <VotingHistory />
          </div>
        </main>
      </div>
    </div>
  )
}
