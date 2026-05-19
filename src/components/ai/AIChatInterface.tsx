"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Building, MapPin, Layers, CheckCircle2, XCircle, BookmarkPlus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const parseToNumeric = (valueStr: string): number => {
  if (!valueStr) return 0;
  const lower = valueStr.toLowerCase();
  
  // Extract all numbers and decimals
  const numMatch = lower.match(/[\d.]+/);
  if (!numMatch) return 0;
  
  const baseNum = parseFloat(numMatch[0]);
  
  if (lower.includes('crore')) {
    return baseNum * 10000000;
  } else if (lower.includes('lac') || lower.includes('lakh')) {
    return baseNum * 100000;
  } else if (lower.includes('m') || lower.includes('million')) {
    return baseNum * 1000000;
  }
  
  // If it's just raw string with commas like "45,000,000"
  const rawNum = parseFloat(valueStr.replace(/,/g, ''));
  return isNaN(rawNum) ? baseNum : rawNum;
};

interface AnalysisResult {
  estimatedValue: string;
  projectedROI: string;
  strengths: string[];
  risks: string[];
}

export function AIChatInterface() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Form State
  const [neighborhood, setNeighborhood] = useState("");
  const [floors, setFloors] = useState("");
  const [area, setArea] = useState("");

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const supabase = createClient();

  const handleAnalyze = async () => {
    if (!neighborhood || !floors || !area) return;
    
    // Validation for gibberish or empty input
    const trimmedNeighborhood = neighborhood.trim();
    const repeatingCharsRegex = /^(.)\1{4,}$/; // matches 5 or more repeating characters
    
    if (trimmedNeighborhood.length < 3 || repeatingCharsRegex.test(trimmedNeighborhood)) {
      setErrorMsg("Please enter a precise location/neighborhood.");
      return;
    }

    setStep("loading");
    setErrorMsg(null);
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ neighborhood, floors, area })
      });
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textError = await res.text();
        throw new Error(`Server Error: ${res.status} ${res.statusText}`);
      }
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(data.error || "Failed to analyze property");
      }
      
      setResult(data);
      setStep("result");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStep("input");
    }
  };

  const reset = () => {
    setNeighborhood("");
    setFloors("");
    setArea("");
    setResult(null);
    setErrorMsg(null);
    setSaveSuccess(false);
    setStep("input");
  };

  const handleSaveToPortfolio = async () => {
    if (!result) return;
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated. Please log in again.");
      
      const parsedValue = parseToNumeric(result.estimatedValue);
      
      // Handle projectedROI as either string or number
      let parsedROI = 0;
      if (typeof result.projectedROI === 'number') {
        parsedROI = result.projectedROI;
      } else if (typeof result.projectedROI === 'string') {
        parsedROI = parseFloat(result.projectedROI.replace(/[^0-9.-]/g, '')) || 0;
      }
      
      const { error } = await supabase.from('user_portfolios').insert({
        user_id: user.id,
        city: neighborhood,
        floors: String(floors),
        area: String(area),
        estimated_value: parsedValue,
        projected_roi: parsedROI,
        key_strengths: result.strengths || [],
        risk_factors: result.risks || []
      });
      
      if (error) throw error;
      setSaveSuccess(true);
    } catch (err: any) {
      console.error("Failed to save to portfolio:", err);
      alert(`Failed to save: ${err.message || 'Unknown error. Please try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-[#3B82F6]/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-[#10B981]" />
        </div>
        <h2 className="text-lg font-bold text-white">FaidaHai AI Agent</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="bg-[#1f1f1f] border border-[#262626] rounded-xl p-4 text-sm text-[#a3a3a3]">
                <p>Hello! I am ready to analyze your property. Please provide the location and details below.</p>
              </div>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-sm text-red-500">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> Location / Neighborhood
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. DHA Phase 6, Lahore"
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-2 flex items-center">
                      <Layers className="w-3 h-3 mr-1" /> Floors
                    </label>
                    <input
                      type="number"
                      value={floors}
                      onChange={(e) => setFloors(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-2 flex items-center">
                      <Building className="w-3 h-3 mr-1" /> Area (sqft)
                    </label>
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!neighborhood || !floors || !area}
                className="w-full mt-4 bg-gradient-to-r from-[#3B82F6] to-[#10B981] hover:opacity-90 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Generate Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full py-12"
            >
              <div className="relative w-20 h-20 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6] to-[#10B981] rounded-full blur-xl opacity-50"
                />
                <div className="absolute inset-2 bg-[#141414] rounded-full z-10 flex items-center justify-center border border-[#262626]">
                  <Sparkles className="w-8 h-8 text-[#10B981] animate-pulse" />
                </div>
              </div>
              <h3 className="text-white font-medium mb-2">Analyzing Data Points...</h3>
              <p className="text-sm text-[#a3a3a3]">Consulting FaidaHai AI for {neighborhood} market</p>
              
              <div className="w-full max-w-xs mt-8 space-y-3">
                <div className="h-2 bg-[#262626] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#10B981]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1f1f1f] rounded-xl p-4 border border-[#262626]">
                  <p className="text-xs text-[#a3a3a3] uppercase mb-1">Estimated Value</p>
                  <p className="text-xl font-bold text-white">{result.estimatedValue}</p>
                </div>
                <div className="bg-[#1f1f1f] rounded-xl p-4 border border-[#262626]">
                  <p className="text-xs text-[#a3a3a3] uppercase mb-1">Projected ROI</p>
                  <p className="text-xl font-bold text-[#10B981]">{result.projectedROI}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Key Strengths</h4>
                <div className="space-y-2">
                  {result.strengths.map((pro, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#d4d4d4]">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Risk Factors</h4>
                <div className="space-y-2">
                  {result.risks.map((con, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-[#d4d4d4]">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
                <button
                  onClick={reset}
                  className="text-sm text-[#a3a3a3] hover:text-white transition-colors"
                >
                  New Analysis
                </button>
                <button
                  onClick={handleSaveToPortfolio}
                  disabled={isSaving || saveSuccess}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all ${
                    saveSuccess 
                      ? "bg-green-500/10 text-[#10B981] border border-green-500/30" 
                      : "bg-[#1f1f1f] hover:bg-[#262626] text-white border border-[#262626]"
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved to Portfolio!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Add to Portfolio"}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
