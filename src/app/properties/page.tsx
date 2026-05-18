"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Trash2, Building2, MapPin, DollarSign, Percent } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface PortfolioRecord {
  id: string;
  city: string;
  area: string;
  floors: string;
  estimated_value: number;
  projected_roi: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("user_portfolios")
        .select("id, city, area, floors, estimated_value, projected_roi")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProperties(data as PortfolioRecord[]);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("user_portfolios")
      .delete()
      .eq("id", id);
      
    if (!error) {
      setProperties(prev => prev.filter(p => p.id !== id));
    } else {
      console.error("Failed to delete property:", error);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(2)} Crore`;
    } else if (price >= 100000) {
      return `Rs ${(price / 100000).toFixed(2)} Lac`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-extrabold text-white tracking-tight"
          >
            Portfolio Ledger
          </motion.h1>
          <div className="text-[#a3a3a3] font-medium">
            {properties.length} {properties.length === 1 ? "Property" : "Properties"}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-[#a3a3a3]">
            <div className="animate-pulse flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Loading Ledger...</span>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-64 bg-[#141414] border border-[#262626] rounded-2xl border-dashed"
          >
            <Building2 className="w-12 h-12 text-[#525252] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No properties found</h3>
            <p className="text-[#a3a3a3] max-w-sm text-center">
              Head over to the Dashboard and use the AI Chat to analyze and add properties to your portfolio.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#141414] border border-[#262626] rounded-2xl p-6 hover:border-[#3B82F6]/50 transition-colors duration-300 flex flex-col group relative overflow-hidden"
              >
                {/* Delete Button (appears on hover) */}
                <button
                  onClick={() => handleDelete(property.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                  title="Remove from Ledger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{property.city}</h3>
                    <p className="text-sm text-[#a3a3a3]">{property.area} sqft &bull; {property.floors} floors</p>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#262626]">
                    <div className="flex items-center space-x-2 text-[#a3a3a3] mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Estimated Value</span>
                    </div>
                    <div className="text-xl font-bold text-white">
                      {formatPrice(property.estimated_value)}
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#262626]">
                    <div className="flex items-center space-x-2 text-[#a3a3a3] mb-1">
                      <Percent className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Projected ROI</span>
                    </div>
                    <div className="text-xl font-bold text-[#10B981]">
                      {property.projected_roi}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
