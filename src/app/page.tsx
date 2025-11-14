// app/page.tsx
'use client'

import React, { useState } from 'react';
import HeroBanner from './components/HeroBanner';
import AboutUs from './components/AboutUs';
import Providers from './components/Providers';
import AllServices from './services/components/AllServices';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import StackedMasonryGallery from './components/Clinica';
import Services from './components/Services';
import CompactMedicalPlans from './components/CompactMedicalPlans';
import Contact from './components/Contact';
import ClinicInfoStrip from './components/ClinicInfoStrip';
import Process from './components/Process';
import AdultClinicSection from './components/AdultClinicSection';
import AwardsStrip from './components/awardsStrip';
import ScrollToTop from './components/ScrollTop';
import PediatricClinicPromo from './components/clinicaPediatria';

type ViewType = 'home' | 'provider-detail' | 'all-services';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  return (
    <>
      {currentView === 'provider-detail' ? (
        <div className="min-h-screen bg-gray-50">
          {/* ProviderDetail aquí */}
        </div>
      ) : currentView === 'all-services' ? (
        <div className="min-h-screen bg-gray-50">
          <AllServices />
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          <Navbar />
          <HeroBanner />
          <AboutUs />
          <ClinicInfoStrip />
          <Services />
          <CompactMedicalPlans />
          <Providers />
          <AwardsStrip />
          <Process />
          <StackedMasonryGallery />
          <PediatricClinicPromo />
          <Contact />
          <Footer />
          <ScrollToTop showAfterPx={200} hideNearTopPx={4} />
        </div>
      )}
    </>
  );
}

export default App;
