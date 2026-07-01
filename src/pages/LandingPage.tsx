import PageLayout from '../components/layout/PageLayout';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import WhySection from '../components/WhySection';
import PipelineDetailSection from '../components/PipelineDetailSection';
import ServicesSection from '../components/ServicesSection';
import PipelineStatsSection from '../components/PipelineStatsSection';
import UseCasesSection from '../components/UseCasesSection';
import PricingSection from '../components/PricingSection';
import CTASection from '../components/CTASection';

export default function LandingPage() {
  return (
    <PageLayout>
      <Hero />
      <AboutSection />
      <WhySection />
      <PipelineDetailSection />
      <ServicesSection />
      <PipelineStatsSection />
      <UseCasesSection />
      <PricingSection />
      <CTASection />
    </PageLayout>
  );
}
