"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Map, ShieldCheck, Mail, MapPin, Phone, User, ChevronDown, TrendingUp, Plus, Minus } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Box, Cylinder, Sphere } from "@react-three/drei";

// --- 3D Digital City Component ---
function DigitalCity() {
  const groupRef = useRef<any>(null);

  const buildings = useMemo(() => {
    const items = [];
    const gridSize = 12;
    const spacing = 1.5;
    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let z = -gridSize / 2; z < gridSize / 2; z++) {
        if (Math.random() > 0.4) {
          const height = Math.random() * 4 + 0.5;
          items.push({
            position: [x * spacing, height / 2 - 2, z * spacing],
            scale: [1, height, 1]
          });
        }
      }
    }
    return items;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.y += 0.001; // slow spin
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 6, 0, 0]}>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position as any}>
          <boxGeometry args={b.scale as any} />
          <meshBasicMaterial color="#10B981" wireframe={true} transparent opacity={0.2} />
        </mesh>
      ))}
      <gridHelper args={[40, 40, '#3B82F6', '#262626']} position={[0, -2, 0]} />
      
      {/* Floating abstract real estate elements */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[-6, 3, -2]}>
        <Box args={[1, 1, 1]}>
          <meshBasicMaterial color="#3B82F6" wireframe />
        </Box>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5} position={[5, 4, 3]}>
        <Cylinder args={[0.5, 0.5, 1.5, 16]}>
          <meshBasicMaterial color="#10B981" wireframe />
        </Cylinder>
      </Float>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={3} position={[0, 5, -5]}>
        <Sphere args={[0.8, 16, 16]}>
          <meshBasicMaterial color="#8B5CF6" wireframe />
        </Sphere>
      </Float>
    </group>
  );
}

// --- Email Catcher Component ---
const EmailCatcher = ({ placeholder = "Enter your email address" }) => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      router.push(`/login?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mx-auto relative z-30">
      <div className="relative w-full">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373]" />
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder} 
          required 
          className="w-full bg-[#141414]/80 backdrop-blur-md border border-[#262626] rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#10B981] transition-colors"
        />
      </div>
      <button 
        type="submit" 
        className="w-full sm:w-auto px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center space-x-2 shrink-0"
      >
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
};

// --- FAQ Component ---
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-[#262626] py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-xl font-medium text-white group-hover:text-[#10B981] transition-colors">{question}</span>
        {isOpen ? <Minus className="w-6 h-6 text-[#10B981]" /> : <Plus className="w-6 h-6 text-[#737373] group-hover:text-[#10B981] transition-colors" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-[#a3a3a3] leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page Component ---
export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const architects = [
    { name: "Safoora", role: "AI & Spatial Data Lead", desc: "Specializes in vector databases, RAG systems, and embedding optimization." },
    { name: "Eman", role: "Platform Architect", desc: "Expert in scalable cloud infrastructure, PostgreSQL, and security protocols." },
    { name: "Areeba", role: "Frontend & 3D Engineering", desc: "Crafts high-performance WebGL interfaces and premium glassmorphic UX." }
  ];
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      
      {/* Dynamic Capsule Navigation */}
      <motion.nav 
        initial={false}
        animate={{ 
          top: scrolled ? 20 : 0,
          width: scrolled ? "calc(100% - 40px)" : "100%",
          maxWidth: scrolled ? "1200px" : "100%",
          borderRadius: scrolled ? "9999px" : "0px",
          backgroundColor: scrolled ? "rgba(10, 10, 10, 0.85)" : "rgba(10, 10, 10, 0.5)",
          borderBottomColor: scrolled ? "rgba(38, 38, 38, 1)" : "rgba(38, 38, 38, 0)"
        }}
        transition={{ duration: 0.3 }}
        className={`fixed left-1/2 -translate-x-1/2 h-20 flex items-center justify-between px-8 z-50 backdrop-blur-xl border border-transparent ${scrolled ? 'shadow-[0_10_40px_rgba(0,0,0,0.5)]' : 'border-b-[#262626]'}`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#10B981]/20 rounded-lg flex items-center justify-center border border-[#10B981]/30">
            <Building2 className="w-5 h-5 text-[#10B981]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            FaidaHai
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="#tech" className="text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors">Tech</Link>
          
          {/* Location Dropdown */}
          <div 
            className="relative h-full flex items-center" 
            onMouseEnter={() => setIsLocationOpen(true)}
            onMouseLeave={() => setIsLocationOpen(false)}
          >
            <button className="flex items-center space-x-1 text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors py-8">
              <span>Locations</span> <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isLocationOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-[80px] left-1/2 -translate-x-1/2 w-80 bg-[#141414] border border-[#262626] rounded-2xl shadow-2xl p-4 overflow-hidden"
                >
                  <div className="mb-2 px-3 pb-2 border-b border-[#262626]">
                    <span className="text-xs font-bold text-[#737373] uppercase tracking-wider">Top Markets</span>
                  </div>
                  <Link href="/locations/gujrat" className="flex items-start p-3 hover:bg-[#1f1f1f] rounded-xl transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mr-4 group-hover:bg-[#10B981]/20 transition-colors">
                      <TrendingUp className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Gujrat</h4>
                      <p className="text-xs text-[#a3a3a3]">Chenab Orchard & Citi Housing</p>
                    </div>
                  </Link>
                  <Link href="/locations/lahore" className="flex items-start p-3 hover:bg-[#1f1f1f] rounded-xl transition-colors group mt-1">
                    <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center mr-4 group-hover:bg-[#3B82F6]/20 transition-colors">
                      <MapPin className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Lahore</h4>
                      <p className="text-xs text-[#a3a3a3]">DHA Phases & High-Yield Commercial</p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="#about" className="text-sm font-medium text-[#a3a3a3] hover:text-white transition-colors">About</Link>
        </div>

        <Link href="/login">
          <button className="px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 bg-[#10B981] hover:bg-[#059669] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            Get Started
          </button>
        </Link>
      </motion.nav>

      {/* Hero Section (3D + Overlay) */}
      <section className="relative w-full h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 opacity-80">
          <Canvas camera={{ position: [0, 6, 25], fov: 60 }}>
            <fog attach="fog" args={['#0a0a0a', 10, 50]} />
            <DigitalCity />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-transparent z-10" />
        </div>

        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-20 max-w-5xl mx-auto px-4 text-center mt-12"
        >
          <div className="inline-flex items-center space-x-2 mb-8 px-5 py-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[#10B981] text-sm font-bold tracking-widest uppercase">
              Pakistan's Premier Real Estate API
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Unlock the Market's <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] via-[#3B82F6] to-[#10B981] bg-[length:200%_auto] animate-gradient">
              Hidden Value
            </span>
          </h1>
          <p className="text-[#a3a3a3] text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
            Proprietary spatial algorithms, predictive ROI modeling, and institutional-grade portfolio management. Built for agencies and serious investors.
          </p>

          <EmailCatcher />
          
        </motion.div>
      </section>

      {/* Tech Showcase Section */}
      <section id="tech" className="relative w-full py-32 bg-[#0a0a0a] z-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Proprietary Technology Stack</h2>
            <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto">
              We process millions of data points from Zameen, DHA, and local registries to give you an unparalleled analytical advantage.
            </p>
          </div>

          <div className="space-y-32">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-16"
            >
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20">
                  <Building2 className="w-8 h-8 text-[#10B981]" />
                </div>
                <h3 className="text-3xl font-bold">The Portfolio Ledger</h3>
                <p className="text-[#a3a3a3] text-lg leading-relaxed">
                  A centralized, secure vault for your real estate assets. Track historical valuations, project future ROI, and manage your entire institutional portfolio with bank-level security and optimistic UI updates.
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/20 to-transparent rounded-3xl blur-2xl"></div>
                <div className="relative bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-2xl overflow-hidden h-80 flex flex-col justify-center">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-[#1f1f1f] rounded-xl border border-[#262626] flex items-center px-6 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                        <div className="w-10 h-10 bg-[#262626] rounded-lg mr-4"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-[#262626] rounded w-1/3"></div>
                          <div className="h-2 bg-[#262626] rounded w-1/4"></div>
                        </div>
                        <div className="h-6 bg-[#10B981]/20 w-24 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row-reverse items-center gap-16"
            >
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-[#3B82F6]/10 rounded-2xl flex items-center justify-center border border-[#3B82F6]/20">
                  <ShieldCheck className="w-8 h-8 text-[#3B82F6]" />
                </div>
                <h3 className="text-3xl font-bold">FaidaHai AI Valuation Engine</h3>
                <p className="text-[#a3a3a3] text-lg leading-relaxed">
                  Stop guessing. Our bespoke AI Agent uses localized RAG embeddings to synthesize real-time neighborhood comparables, giving you hyper-accurate PKR valuations and risk analyses in seconds.
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-bl from-[#3B82F6]/20 to-transparent rounded-3xl blur-2xl"></div>
                <div className="relative bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-2xl h-80 flex items-center justify-center">
                   <div className="text-center space-y-4">
                     <div className="inline-block p-4 bg-[#1f1f1f] rounded-2xl border border-[#3B82F6]/30 mb-4">
                       <span className="text-4xl font-mono text-[#3B82F6]">4.2 Crore</span>
                     </div>
                     <p className="text-[#10B981] font-mono tracking-widest uppercase text-sm">+14.5% Projected Yield</p>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative w-full py-32 bg-[#050505] z-20 border-t border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-[#a3a3a3] text-lg">Everything you need to know about the FaidaHai platform.</p>
          </div>

          <div className="space-y-2">
            <FAQItem 
              question="Where does your pricing data come from?" 
              answer="We aggregate data from multiple public and private sources, including direct feeds from major agencies, public registry data, and historically scraped pricing logs. Our AI then normalizes this data using spatial embeddings to account for hyper-local market variations." 
            />
            <FAQItem 
              question="Do you cover cities other than Lahore?" 
              answer="Yes. While our primary high-fidelity vector datasets are centered on Lahore and Gujrat (e.g., Chenab Orchard, Citi Housing), our AI model has fallback macroeconomic intelligence covering all of Pakistan's major tier-1 and tier-2 cities." 
            />
            <FAQItem 
              question="Is my portfolio data secure?" 
              answer="Absolutely. We employ Row Level Security (RLS) via Supabase, meaning your data is cryptographically isolated. No one else, not even our analytics team, can view your exact portfolio holdings without authorization." 
            />
            <FAQItem 
              question="How do I get access to the Client Portal?" 
              answer="The platform is currently in a restricted rollout phase. You can sign up using the Get Started form. Accounts are approved on a rolling basis to ensure server stability." 
            />
          </div>
        </div>
      </section>

      {/* Bottom Email Catcher */}
      <section className="relative w-full py-32 bg-[#0a0a0a] z-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/5 to-transparent z-0"></div>
        <div className="max-w-3xl mx-auto px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to dominate the market?</h2>
          <p className="text-[#a3a3a3] text-xl mb-12">Join elite investors using AI to find the best yields in Pakistan.</p>
          <EmailCatcher placeholder="Enter your best email address" />
        </div>
      </section>

      {/* The Neural Architects Section */}
      <section id="about" className="relative w-full py-32 bg-[#050505] z-20 overflow-hidden border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Neural Architects</h2>
            <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto">
              Incubated at the <span className="text-[#10B981] font-semibold">Adan IT Center</span>, our engineering team fuses spatial data science with enterprise software architecture.
            </p>
          </div>

          <div className="flex overflow-x-hidden relative py-4">
             <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
             
             <motion.div 
               animate={{ x: ["0%", "-50%"] }}
               transition={{ ease: "linear", duration: 25, repeat: Infinity }}
               className="flex space-x-8 whitespace-nowrap pl-8"
             >
                {[...architects, ...architects].map((member, i) => (
                  <div key={i} className="inline-block w-80 bg-[#0a0a0a] border border-[#262626] rounded-3xl p-8 shrink-0 shadow-lg hover:border-[#3B82F6]/50 transition-colors">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#10B981] p-1 mb-6 mx-auto">
                       <div className="w-full h-full rounded-full bg-[#141414] flex items-center justify-center">
                         <User className="w-8 h-8 text-[#a3a3a3]" />
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-center text-white mb-2">{member.name}</h3>
                    <p className="text-sm text-center text-[#10B981] font-mono mb-4">{member.role}</p>
                    <p className="text-sm text-center text-[#737373] whitespace-normal leading-relaxed">
                      {member.desc}
                    </p>
                  </div>
                ))}
             </motion.div>
          </div>
        </div>
      </section>

      {/* Fat Footer */}
      <footer className="w-full bg-[#050505] border-t border-[#1a1a1a] pt-24 pb-12 z-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Building2 className="w-6 h-6 text-[#10B981]" />
                <span className="text-2xl font-bold text-white">FaidaHai</span>
              </div>
              <p className="text-[#737373] max-w-sm leading-relaxed mb-8">
                The premier intelligence platform for institutional real estate investors operating in the Pakistan market.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center hover:border-[#10B981] transition-colors cursor-pointer"><span className="text-[#a3a3a3]">𝕏</span></div>
                <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center hover:border-[#10B981] transition-colors cursor-pointer"><span className="text-[#a3a3a3]">in</span></div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-[#737373]">
                <li><Link href="/locations/gujrat" className="hover:text-[#10B981] transition-colors">Gujrat Markets</Link></li>
                <li><Link href="/locations/lahore" className="hover:text-[#10B981] transition-colors">Lahore Markets</Link></li>
                <li><Link href="/faq" className="hover:text-[#10B981] transition-colors">FAQ</Link></li>
                <li><Link href="/about" className="hover:text-[#10B981] transition-colors">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-[#737373]">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1a1a1a] text-[#525252] text-sm">
            <p>&copy; {new Date().getFullYear()} FaidaHai Technologies. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Lahore, Pakistan</span>
              <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> Enterprise Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
