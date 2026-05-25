"use client";

import { useTracking } from "@/hooks/useTracking";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";
import { Welcome } from "@/components/Welcome";
import { VideoStory } from "@/components/VideoStory";
import { WhyUs } from "@/components/WhyUs";
import { Locations } from "@/components/Locations";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { SITE_ID, SITE_KEY, TERRITORIES, type TerritoryId } from "@/components/Brand";

interface TerritoryPageProps {
  territoryId: TerritoryId;
}

export function TerritoryPage({ territoryId }: TerritoryPageProps) {
  useTracking({ siteKey: SITE_KEY, siteId: SITE_ID });
  const territory = TERRITORIES[territoryId];

  return (
    <main className="bg-white">
      <QueryParamPersistence />
      <Header territory={territory} />
      <Hero territory={territory} />
      <Stats />
      <Services territory={territory} />
      <HowItWorks territory={territory} />
      <Welcome territory={territory} />
      <VideoStory territory={territory} />
      <WhyUs territory={territory} />
      <Locations territory={territory} />
      <Testimonials />
      <FAQ territory={territory} />
      <Contact territory={territory} />
      <Footer territory={territory} />
      <FloatingCTA />
    </main>
  );
}
