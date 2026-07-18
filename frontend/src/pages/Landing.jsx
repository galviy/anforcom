import { useEffect, useState } from 'react';
import { userAPI } from '../api/api';
import NavBar from '../components/sections/NavBar';
import Hero from '../components/sections/Hero';
import Tentang from '../components/sections/Tentang';
import Kompetisi from '../components/sections/Kompetisi';
import Linimasa from '../components/sections/Linimasa';
import Rewards from '../components/sections/Rewards';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';
import Footer from '../components/sections/Footer';

export default function Landing() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    userAPI.getMe()
      .then((res) => setUser(res))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#14532D]">
      <NavBar user={user} checkingSession={checkingSession} />
      <Hero />
      <Tentang />
      <Kompetisi /> 
      <Linimasa />
      <Rewards />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
