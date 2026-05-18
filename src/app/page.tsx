"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, Map, ShieldCheck, Mail, MapPin, Phone } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";


// --- 3D Neural Grid Component ---
function NeuralGrid() {
  const ref = useRef<any>(null);
  
  // Create a grid of points
  const points = useMemo(() => {
    const positions = [];
    const size = 30;
    const step = 1.5;
    
    for (let x = -size; x <= size; x += step) {
      for (let z = -size; z <= size; z += step) {
        // Create an organic terrain-like wave using sin/cos
        const y = Math.sin(x * 0.2) * Math.cos(z * 0.2) * 1.5 + (Math.random() * 0.5);
        positions.push(x, y, z);
      }
    }
    return new Float32Array(positions);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      // Parallax effect based on mouse movement
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      
      ref.current.rotation.x += (targetY - ref.current.rotation.x) * 0.05;
      ref.current.rotation.y += (targetX - ref.current.rotation.y) * 0.05;
      
      // Slow continuous spin
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <group rotation={[Math.PI / 6, 0, 0]}>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#10B981"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

// --- Main Page Component ---
export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  
  // Parallax transformations for scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed w-full h-20 flex items-center justify-between px-8 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#262626]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#10B981]/20 rounded-lg flex items-center justify-center border border-[#10B981]/30">
            <Building2 className="w-5 h-5 text-[#10B981]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            FaidaHai
          </span>
        </div>
        <Link href="/login">
          <button className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 bg-[#141414] border border-[#262626] text-white hover:bg-[#1f1f1f] hover:border-[#10B981]/50">
            Client Portal
          </button>
        </Link>
      </nav>

      {/* Hero Section (3D + Overlay) */}
      <section className="relative w-full h-screen flex items-center justify-center pt-20">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-0 opacity-70">
          <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
            <fog attach="fog" args={['#0a0a0a', 10, 40]} />
            <NeuralGrid />
          </Canvas>
          {/* Gradients to blend 3D into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-transparent z-10" />
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-20 max-w-5xl mx-auto px-4 text-center"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 backdrop-blur-md text-[#10B981] text-sm font-semibold tracking-wide">
            ENTERPRISE INTELLIGENCE ENGINE
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            The Palantir of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] via-[#3B82F6] to-[#10B981] bg-[length:200%_auto] animate-gradient">
              Pakistan Real Estate
            </span>
          </h1>
          <p className="text-[#a3a3a3] text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
            Proprietary spatial algorithms, predictive ROI modeling, and 3D market heatmaps. Built for institutional investors and elite agencies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="flex items-center justify-center space-x-2 w-full px-8 py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]">
                <span>Enter App</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <div className="w-full sm:w-auto relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#10B981] to-[#3B82F6] rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <button className="relative w-full px-8 py-4 bg-[#141414] text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5 text-[#3B82F6]" />
                <span>Join Waitlist</span>
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tech Showcase Section */}
      <section className="relative w-full py-32 bg-[#0a0a0a] z-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Proprietary Technology Stack</h2>
            <p className="text-[#a3a3a3] text-lg max-w-2xl mx-auto">
              We process millions of data points from Zameen and DHA to give you an unparalleled analytical advantage.
            </p>
          </div>

          <div className="space-y-32">
            {/* Feature 1 */}
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

            {/* Feature 2 */}
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

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-16"
            >
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                  <Map className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-3xl font-bold">3D Spatial Heatmaps</h3>
                <p className="text-[#a3a3a3] text-lg leading-relaxed">
                  Visualize market inefficiencies before they become mainstream. Our high-performance WebGL heatmaps plot inverse ROI correlations across geographic sectors at a fluid 60 FPS.
                </p>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-3xl blur-2xl"></div>
                <div className="relative bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-2xl h-80 overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-2 p-6 opacity-30 transform rotate-12 scale-150">
                    {Array.from({length: 36}).map((_, i) => (
                      <div key={i} className={`rounded-md ${i % 3 === 0 ? 'bg-purple-500' : i % 5 === 0 ? 'bg-[#10B981]' : 'bg-[#262626]'}`} style={{ opacity: Math.random() }}></div>
                    ))}
                  </div>
                </div>
              </div>
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
                {/* Social placeholders */}
                <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center hover:border-[#10B981] transition-colors cursor-pointer"><span className="text-[#a3a3a3]">𝕏</span></div>
                <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center hover:border-[#10B981] transition-colors cursor-pointer"><span className="text-[#a3a3a3]">in</span></div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-[#737373]">
                <li className="hover:text-[#10B981] transition-colors cursor-pointer">Portfolio Ledger</li>
                <li className="hover:text-[#10B981] transition-colors cursor-pointer">AI Valuation</li>
                <li className="hover:text-[#10B981] transition-colors cursor-pointer">Market Heatmaps</li>
                <li className="hover:text-[#10B981] transition-colors cursor-pointer">API Access</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-[#737373]">
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Security Protocol</li>
                <li className="hover:text-white transition-colors cursor-pointer">Cookie Policy</li>
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
