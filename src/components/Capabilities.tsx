import { motion } from 'framer-motion';
import FadingVideo from './FadingVideo';
import { ImageIcon, MovieIcon, LightbulbIcon } from './Icons';

export default function Capabilities() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { filter: 'blur(10px)', opacity: 0, y: 30 },
    visible: { filter: 'blur(0px)', opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const overlayVariants: any = {
    hidden: { opacity: 1 },
    visible: { opacity: 0.4, transition: { duration: 1.5, ease: "easeInOut" } }
  };

  return (
    <section className="min-h-screen overflow-hidden bg-black relative">
      {/* Background Video */}
      <FadingVideo 
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Animated Overlay */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={overlayVariants}
        className="absolute inset-0 bg-black z-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-auto"
        >
          <p className="text-sm font-body text-zinc-900 dark:text-zinc-700 dark:text-white/80 mb-6">// Capabilities</p>
          <h2 className="font-heading italic text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] whitespace-pre-line">
            {"Studio craft,\nend to end"}
          </h2>
        </motion.div>

        {/* Cards grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col hover:-translate-y-2 transition-transform duration-500">
            <div className="flex justify-between items-start">
              <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5 text-zinc-900 dark:text-white/90" />
              </div>
              <div className="flex flex-wrap justify-end gap-1.5 ml-4">
                {["Brand Systems", "Art Direction", "Visual Identity", "Motion"].map(tag => (
                  <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-zinc-900 dark:text-white/90 font-body whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1"></div>
            <div>
              <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none mb-4">Design</h3>
              <p className="text-sm text-zinc-900 dark:text-white/90 font-body font-light leading-snug max-w-[32ch]">
                We shape identities and interfaces that feel unmistakably yours — typographic systems, component libraries, and art-directed pages that scale without losing soul.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col hover:-translate-y-2 transition-transform duration-500">
            <div className="flex justify-between items-start">
              <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center shrink-0">
                <MovieIcon className="w-5 h-5 text-zinc-900 dark:text-white/90" />
              </div>
              <div className="flex flex-wrap justify-end gap-1.5 ml-4">
                {["React", "Next.js", "Headless CMS", "Edge-Ready"].map(tag => (
                  <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-zinc-900 dark:text-white/90 font-body whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1"></div>
            <div>
              <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none mb-4">Engineering</h3>
              <p className="text-sm text-zinc-900 dark:text-white/90 font-body font-light leading-snug max-w-[32ch]">
                Production-grade front-ends built on modern stacks. Performant, accessible, and instrumented — with code your team will enjoy extending long after launch.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col hover:-translate-y-2 transition-transform duration-500">
            <div className="flex justify-between items-start">
              <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center shrink-0">
                <LightbulbIcon className="w-5 h-5 text-zinc-900 dark:text-white/90" />
              </div>
              <div className="flex flex-wrap justify-end gap-1.5 ml-4">
                {["SEO", "Analytics", "A/B Testing", "Retention"].map(tag => (
                  <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-zinc-900 dark:text-white/90 font-body whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1"></div>
            <div>
              <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none mb-4">Growth</h3>
              <p className="text-sm text-zinc-900 dark:text-white/90 font-body font-light leading-snug max-w-[32ch]">
                Launch is the starting line. We partner with your team on conversion, content, and iteration loops that turn a beautiful site into a compounding asset.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
