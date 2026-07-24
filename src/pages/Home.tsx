import Navbar from '@/sections/Navbar'
import Hero from '@/sections/Hero'
import Watch from '@/sections/Watch'
import LiveRooms from '@/sections/LiveRooms'
import HipHop from '@/sections/HipHop'
import Creators from '@/sections/Creators'
import CreatorFund from '@/sections/CreatorFund'
import FAQ from '@/sections/FAQ'
import Studio from '@/sections/Studio'
import Mission from '@/sections/Mission'
import Footer from '@/sections/Footer'
import Griot from '@/components/Griot'
import BottomBar from '@/components/BottomBar'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0908] pb-24 font-body text-[#F5EFE6] antialiased">
      <Navbar />
      <main>
        <Hero />
        <Watch />
        <LiveRooms />
        <HipHop />
        <Creators />
        <CreatorFund />
        <FAQ />
        <Studio />
        <Mission />
      </main>
      <Griot />
      <BottomBar />
      <Footer />
    </div>
  )
}
