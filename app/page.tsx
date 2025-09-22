import { NewsSubmissionForm } from "@/components/news-submission-form"
import { NewsFeed } from "@/components/news-feed"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-balance">Social Truth</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Decentralized news verification powered by Cardano blockchain
              </p>
            </div>

            <NewsSubmissionForm />
            <NewsFeed />
          </div>
        </main>
      </div>
    </div>
  )
}
