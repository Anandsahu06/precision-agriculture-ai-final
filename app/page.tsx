import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { ProblemSolution } from "@/components/landing/problem-solution"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProblemSolution />
      <Footer />
    </>
  )
}
