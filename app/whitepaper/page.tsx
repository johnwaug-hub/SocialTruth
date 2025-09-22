import { Header } from "@/components/header"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WhitePaperPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Social Truth White Paper</h1>
            <p className="text-xl text-muted-foreground">
              A Comprehensive Guide to Decentralized News Verification on Cardano
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                White Paper Overview
              </CardTitle>
              <CardDescription>
                Learn about the technical architecture, tokenomics, and governance model of Social Truth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Key Topics Covered:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Decentralized news verification protocol</li>
                    <li>• TRUTH token economics and distribution</li>
                    <li>• NFT-based validator ranking system</li>
                    <li>• Location-based verification mechanisms</li>
                    <li>• Reward and penalty algorithms</li>
                    <li>• Smart contract architecture</li>
                    <li>• Governance and community voting</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Technical Specifications:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 10,000,000 TRUTH token supply</li>
                    <li>• Multi-tier validator NFT system</li>
                    <li>• Plutus smart contract implementation</li>
                    <li>• IPFS content storage</li>
                    <li>• Cardano blockchain integration</li>
                    <li>• Real-time reputation scoring</li>
                    <li>• Geographic validation protocols</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ExternalLink className="w-4 h-4" />
                  View Online
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Abstract</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Social Truth introduces a revolutionary approach to news verification using blockchain technology,
                  incentivizing truthful reporting through tokenized rewards and community validation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tokenomics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed analysis of the TRUTH token distribution, staking mechanisms, validator rewards, and the
                  economic incentives that drive platform participation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Technical roadmap, smart contract specifications, and integration guidelines for developers building
                  on the Social Truth protocol.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
