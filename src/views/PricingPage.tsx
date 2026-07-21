import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

export default function PricingPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [billingMode, setBillingMode] = useState<'credits' | 'monthly'>('credits');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Starter",
      featured: false,
      priceCredits: "Free",
      priceMonthly: "Free",
      subCredits: "3 credits on signup · no card needed",
      subMonthly: "3 credits on signup · no card needed",
      features: [
        { name: "3 document generations", included: true },
        { name: "Up to 4 screens per project", included: true },
        { name: "Full ZIP download", included: true },
        { name: "Riverpod 2.x + go_router", included: true },
        { name: "Priority AI queue", included: false },
        { name: "Custom design tokens", included: false },
        { name: "API access", included: false }
      ],
      cta: "Start free"
    },
    {
      name: "Pro",
      featured: true,
      priceCredits: "₹999",
      priceMonthly: "₹799/mo",
      subCredits: "50 credits · never expire",
      subMonthly: "50 credits per month",
      features: [
        { name: "50 document generations", included: true },
        { name: "Up to 6 screens per project", included: true },
        { name: "Full ZIP download", included: true },
        { name: "Riverpod 2.x + go_router", included: true },
        { name: "Priority AI queue", included: true },
        { name: "Custom design tokens", included: true },
        { name: "API access", included: false }
      ],
      cta: "Get Pro"
    },
    {
      name: "Team",
      featured: false,
      priceCredits: "₹3,499",
      priceMonthly: "₹2,799/mo",
      subCredits: "Unlimited · team workspace",
      subMonthly: "Unlimited · team workspace",
      features: [
        { name: "Unlimited generations", included: true },
        { name: "Up to 6 screens per project", included: true },
        { name: "Full ZIP download", included: true },
        { name: "Team workspace (coming soon)", included: true },
        { name: "API access (coming soon)", included: true },
        { name: "Custom design tokens", included: true },
        { name: "Priority support", included: true }
      ],
      cta: "Contact Sales"
    }
  ];

  const comparison = [
    { feature: "Document uploads per month", starter: "3", pro: "50", team: "Unlimited" },
    { feature: "Max screens per project", starter: "4", pro: "6", team: "6" },
    { feature: "Nemotron OCR", starter: true, pro: true, team: true },
    { feature: "Knowledge graph", starter: true, pro: true, team: true },
    { feature: "Cross-doc RAG", starter: true, pro: true, team: true },
    { feature: "PDF workspace", starter: true, pro: true, team: true },
    { feature: "Highlight + notes", starter: true, pro: true, team: true },
    { feature: "Flashcards + quiz", starter: false, pro: true, team: true },
    { feature: "Priority AI queue", starter: false, pro: true, team: true },
    { feature: "Custom design tokens", starter: false, pro: true, team: true },
    { feature: "API access", starter: false, pro: false, team: true },
    { feature: "Team workspace", starter: false, pro: false, team: "Soon" }
  ];

  const faqs = [
    {
      q: "Do credits expire?",
      a: "Never. Buy credits once and use them at any pace. Monthly plan credits reset each billing cycle."
    },
    {
      q: "What counts as one credit?",
      a: "One credit = one document generation. Uploading 6 Figma screens and downloading the Flutter ZIP uses one credit."
    },
    {
      q: "Can I upgrade or downgrade?",
      a: "Yes. Switch plans any time. Unused credits carry over when upgrading."
    },
    {
      q: "Is there a free trial?",
      a: "Yes — 3 free credits on signup. No card required. Try the full pipeline before paying anything."
    }
  ];

  const renderIcon = (val: string | boolean | undefined) => {
    if (val === true) return <CheckCircle className="text-emerald-400 w-4 h-4 mx-auto" />;
    if (val === false) return <Minus className={`w-4 h-4 mx-auto ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`} />;
    return <span className={`text-sm ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>{val}</span>;
  };

  return (
    <PageWrapper
      eyebrow="Simple pricing"
      heading="Pay for what you use"
      subtext="Credits never expire. No subscriptions. Buy once and generate whenever you need."
    >
      <div className="mt-10 flex items-center justify-center gap-4">
        <div className={`p-1 flex items-center gap-1 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-[#0D0D0D]/5'}`}>
          <button
            onClick={() => setBillingMode('credits')}
            className={`px-5 py-2 text-sm rounded-full transition-all ${
              billingMode === 'credits' 
                ? (theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white') 
                : (theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50')
            }`}
          >
            Credits
          </button>
          <button
            onClick={() => setBillingMode('monthly')}
            className={`px-5 py-2 text-sm rounded-full transition-all flex items-center gap-2 ${
              billingMode === 'monthly' 
                ? (theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white') 
                : (theme === 'dark' ? 'text-white/50' : 'text-[#0D0D0D]/50')
            }`}
          >
            Monthly
            {billingMode === 'monthly' && (
              <span className="bg-emerald-500/10 text-emerald-400 rounded-full px-2 py-0.5 text-xs ml-2">Save 20%</span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-2xl p-6 md:p-8 relative flex flex-col ${
              plan.featured 
                ? (theme === 'dark' ? 'bg-white/[0.03] border-2 border-white/30' : 'bg-[#0D0D0D]/[0.03] border-2 border-[#0D0D0D]/25')
                : (theme === 'dark' ? 'bg-[#161B22] border border-white/8' : 'bg-white border border-[#0D0D0D]/8')
            }`}
          >
            {plan.featured && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold whitespace-nowrap ${
                theme === 'dark' ? 'bg-white text-black' : 'bg-[#0D0D0D] text-white'
              }`}>
                Most popular
              </div>
            )}
            
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
              {plan.name}
            </h3>
            
            <div className={`text-3xl font-['Instrument_Serif'] mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
              {billingMode === 'credits' ? plan.priceCredits : plan.priceMonthly}
            </div>
            
            <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
              {billingMode === 'credits' ? plan.subCredits : plan.subMonthly}
            </div>
            
            <div className={`border-t my-6 ${theme === 'dark' ? 'border-white/10' : 'border-[#0D0D0D]/10'}`} />
            
            <div className="flex flex-col gap-3 text-sm flex-1">
              {plan.features.map((feature, idx) => (
                <div key={idx} className={`flex items-start gap-3 ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>
                  {feature.included ? (
                    <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${theme === 'dark' ? 'text-white/40' : 'text-[#0D0D0D]/40'}`} />
                  ) : (
                    <Minus className={`w-4 h-4 shrink-0 mt-0.5 ${theme === 'dark' ? 'text-white/20' : 'text-[#0D0D0D]/20'}`} />
                  )}
                  <span className={feature.included ? '' : `opacity-50`}>{feature.name}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/register')}
              className={`w-full py-3 rounded-xl text-sm font-medium mt-8 transition-colors ${
                plan.featured
                  ? (theme === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90')
                  : (theme === 'dark' ? 'border border-white/15 text-white hover:bg-white/5' : 'border border-[#0D0D0D]/15 text-[#0D0D0D] hover:bg-[#0D0D0D]/5')
              }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 max-w-4xl mx-auto">
        <h2 className={`text-2xl font-semibold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
          Full comparison
        </h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[500px] border-collapse text-sm text-center">
            <thead>
              <tr className={`${theme === 'dark' ? 'bg-[#161B22]' : 'bg-white'} border-b ${theme === 'dark' ? 'border-white/10' : 'border-[#0D0D0D]/10'}`}>
                <th className={`py-4 px-4 text-left font-medium ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>Feature</th>
                <th className={`py-4 px-4 font-medium ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>Starter</th>
                <th className={`py-4 px-4 font-medium ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>Pro</th>
                <th className={`py-4 px-4 font-medium ${theme === 'dark' ? 'text-white/80' : 'text-[#0D0D0D]/80'}`}>Team</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={i} className={`border-b ${theme === 'dark' ? 'border-white/5' : 'border-[#0D0D0D]/5'} ${i % 2 === 0 ? (theme === 'dark' ? 'bg-white/[0.01]' : 'bg-[#0D0D0D]/[0.01]') : ''}`}>
                  <td className={`py-4 px-4 text-left ${theme === 'dark' ? 'text-white/70' : 'text-[#0D0D0D]/70'}`}>{row.feature}</td>
                  <td className="py-4 px-4">{renderIcon(row.starter)}</td>
                  <td className="py-4 px-4">{renderIcon(row.pro)}</td>
                  <td className="py-4 px-4">{renderIcon(row.team)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-24 max-w-2xl mx-auto">
        <h2 className={`text-2xl font-semibold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}>
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`border rounded-xl overflow-hidden ${theme === 'dark' ? 'border-white/10' : 'border-[#0D0D0D]/10'}`}>
              <button
                className={`w-full flex items-center justify-between p-6 text-left ${theme === 'dark' ? 'text-white' : 'text-[#0D0D0D]'}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <span className="font-medium">{faq.q}</span>
                {activeFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {activeFaq === i && (
                <div className={`px-6 pb-6 text-sm leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-[#0D0D0D]/60'}`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
