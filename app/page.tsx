import { NewsSubmissionForm } from "@/components/news-submission-form"
import { NewsFeed } from "@/components/news-feed"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Vote, Trophy } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-6 py-8">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/social-truth-main-logo.png"
                  alt="Social Truth - Reality | Majority"
                  width={120}
                  height={120}
                  className="rounded-2xl"
                />
              </div>

              <h1 className="text-5xl font-bold text-balance social-truth-navy">SOCIAL TRUTH</h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Decentralized news verification powered by Cardano blockchain. Submit news, vote on accuracy, and earn
                reputation through truthful validation.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Badge className="social-truth-badge text-slate-900 px-4 py-2 text-sm font-medium">
                  <Shield className="w-4 h-4 mr-2" />
                  NFT Validator System
                </Badge>
                <Badge className="social-truth-badge text-slate-900 px-4 py-2 text-sm font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  1,247 Active Validators
                </Badge>
                <Badge className="social-truth-badge text-slate-900 px-4 py-2 text-sm font-medium">
                  <Vote className="w-4 h-4 mr-2" />
                  Truth Token Rewards
                </Badge>
                <Badge className="social-truth-badge text-slate-900 px-4 py-2 text-sm font-medium">
                  <Trophy className="w-4 h-4 mr-2" />
                  Reputation Based
                </Badge>
              </div>
            </div>

            <NewsSubmissionForm />
            <NewsFeed />
          </div>
        </main>
      </div>
    </div>
  )
}
