import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Hero from '../components/landing/Hero.jsx'
import Features from '../components/landing/Features.jsx'
import HowItWorks from '../components/landing/HowItWorks.jsx'
import CtaBand from '../components/landing/CtaBand.jsx'
import Disclaimer from '../components/landing/Disclaimer.jsx'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-mist-50">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CtaBand />
        <Disclaimer />
      </main>
      <Footer />
    </div>
  )
}
