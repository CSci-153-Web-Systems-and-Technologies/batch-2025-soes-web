"use client";

import Phone from "@/app/(landing)/_components/Phone";
import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Vote,
  Eye,
  Zap,
  Bell,
  Globe,
  Users,
  UserCheck,
  BarChart3,
  Smartphone,
} from "lucide-react";
import LandingCard from "@/app/(landing)/_components/LandingCard";
import { useRouter } from "next/navigation";

interface informationProps {
  number: string;
  title: string;
  description: string;
}

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

const Information = ({ number, title, description }: informationProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-800 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen">
      {/* Section 1 */}
      <section className="px-4 pb-36 pt-16">
        <div className="container mx-auto max-w-8xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <div className="mb-6 leading-tight">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  <BlurText
                    text="All Your Elections In One Place."
                    delay={150}
                    animateBy="words"
                    direction="top"
                    onAnimationComplete={handleAnimationComplete}
                  />
                </h1>

                <p className="text-muted-foreground mb-8 max-w-3xl">
                  Streamline your student organizations elections with a secure
                  transparent, and modern platform designed for administrators,
                  voters, and public transparency
                </p>

                <Button className="w-44 h-9 bg-green-700 font-bold text-base text-white hover:bg-green-900" onClick={() => router.push('/signup')}>
                  Get Started
                </Button>

                <div className="mt-5 flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full bg-green-900/30 border-2 border-background flex items-center justify-center">
                        <Shield className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-green-900/30 border-2 border-background flex items-center justify-center">
                        <Vote className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-green-900/30 border-2 border-background flex items-center justify-center">
                        <Eye className="w-4 h-4 text-foreground" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-5 text-foreground">
                          ★
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Secure & Transparent
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="w-full aspect-square max-w-md mx-auto flex justify-center">
                <Phone phoneState={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="py-10 px-4 pt-25 sm:pt-10 sm:pb-20 md:pb-40 h-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="mb-4 font-bold sm:text-xl md:text-3xl">
              <BlurText
                text="Why SOES?"
                delay={150}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="flex justify-center"
              />
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for student organizations with everything you
              need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LandingCard
              Icon={Zap}
              title="Eeasy To Use"
              description="Intuitive interface that makes managing elections simple for administrators and voting effortless for students."
              type="one"
            />
            <LandingCard
              Icon={Bell}
              title="Real-Time Updates"
              description="Live notifications and instant updates on election progress, vote counts, and participation rates."
              type="one"
            />
            <LandingCard
              Icon={Globe}
              title="Multi-Session Support"
              description="Manage multiple elections simultaneously with session-specific candidates, voters, and configurations."
              type="one"
            />
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="py-10 px-4 sm:pb-20 md:pb-40 h-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="mb-4 font-bold sm:text-xl md:text-3xl">
              <BlurText
                text="Get Started in Minutes"
                delay={150}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="flex justify-center"
              />
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to launch your first election
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6">
              <Information
                number="1"
                title="Create an election session"
                description="Configure your organization details, create position
                    templates, and add your branding."
              />
              <Information
                number="2"
                title="Set up your organization"
                description="Set election dates, add candidates with photos, and upload
                    your voter list for the specific election."
              />
              <Information
                number="3"
                title="Share voting links"
                description="Generate unique voting links and distribute them to your
                    registered voters securely."
              />
              <Information
                number="4"
                title="Monitor & publish results"
                description="Track votes in real-time and publish transparent results for
                    everyone to see."
              />
            </div>

            {/* Right */}
            <div className="relative">
              <div className="w-full aspect-square max-w-md mx-auto flex justify-center">
                <Phone phoneState={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className="py-10 px-4 pt-45 sm:pt-10 pb-5 h-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="mb-4 font-bold sm:text-xl md:text-3xl">
              <BlurText
                text="Everything You Need"
                delay={150}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="flex justify-center"
              />
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive features for modern student elections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LandingCard
              Icon={Shield}
              title="Secure Authentication"
              description="One-time voting codes ensure security and anonymity"
              type="two"
            />
            <LandingCard
              Icon={Users}
              title="Candidate Management"
              description="Add candidates with photos, partylists, and details"
              type="two"
            />
            <LandingCard
              Icon={UserCheck}
              title="Voter Management"
              description="Manage voter lists per election session"
              type="two"
            />
            <LandingCard
              Icon={BarChart3}
              title="Live Analytics"
              description="Real-time vote tracking and participation metrics"
              type="two"
            />
            <LandingCard
              Icon={Eye}
              title="Public Results"
              description="Transparent results accessible to everyone"
              type="two"
            />
            <LandingCard
              Icon={Smartphone}
              title="Mobile Responsive"
              description="Optimized for all devices and screen sizes"
              type="two"
            />
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-12 text-primary-foreground">
            <h2 className="mb-5 text-xl font-bold">
              Ready to modernize your elections?
            </h2>
            <p className="mb-8 opacity-90 max-w-2xl mx-auto">
              Join student organizations using SOES for secure, transparent, and
              efficient elections.
            </p>

            <div className="flex items-center justify-center gap-10 flex-wrap">
              <Button className="bg-background px-10 font-bold text-foreground hover:bg-background/70">
                Setup Now
              </Button>
              <Button className="bg-background px-10 font-bold text-foreground hover:bg-background/70">
                Vote Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
