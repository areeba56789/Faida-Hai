import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch all market data since the volume is under a few hundred rows
    const { data: properties, error } = await supabase
      .from("market_data")
      .select("location, price, area_sqft");
      
    if (error) {
      throw error;
    }

    if (!properties || properties.length === 0) {
      return NextResponse.json([]);
    }

    // Aggregate by location (neighborhood text string)
    const aggregated: Record<string, { totalValue: number; count: number; locations: string[] }> = {};
    
    properties.forEach((p) => {
      // Normalize location string
      const loc = (p.location || "Unknown").trim();
      
      if (!aggregated[loc]) {
        aggregated[loc] = { totalValue: 0, count: 0, locations: [loc] };
      }
      aggregated[loc].totalValue += (Number(p.price) || 0);
      aggregated[loc].count += 1;
    });

    // Create a 2D layout map for locations
    const locations = Object.keys(aggregated).sort();
    
    // Calculate min and max average prices to establish the range for inverse ROI calculation
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    locations.forEach(loc => {
        const averagePrice = aggregated[loc].totalValue / aggregated[loc].count;
        if (averagePrice < minPrice) minPrice = averagePrice;
        if (averagePrice > maxPrice) maxPrice = averagePrice;
    });
    
    // Fallback if all prices are identical
    if (minPrice === maxPrice) {
        minPrice = 0;
    }

    const result: Array<{label: string, x: number, z: number, value: number, roi: number, count: number}> = [];
    
    // We will place them in a spiral or grid pattern
    const gridSize = Math.ceil(Math.sqrt(locations.length));
    
    locations.forEach((loc, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      const count = aggregated[loc].count;
      const averagePrice = aggregated[loc].totalValue / count;
      
      // Inverse ROI Calculation: High Price = Low ROI (6%), Low Price = High ROI (15%)
      const maxROI = 15;
      const minROI = 6;
      let roi = maxROI;
      
      if (maxPrice > minPrice) {
        roi = maxROI + (averagePrice - minPrice) * ((minROI - maxROI) / (maxPrice - minPrice));
      }
      
      // Add a bit of jitter to the position so it's not a perfectly rigid grid
      // Use a deterministic pseudo-random based on string length and char code
      const hash = loc.charCodeAt(0) + loc.length;
      const jitterX = ((hash % 10) / 10) - 0.5;
      const jitterZ = (((hash / 10) % 10) / 10) - 0.5;

      // Space them out by 2 units
      const x = (col - gridSize / 2) * 2 + jitterX;
      const z = (row - gridSize / 2) * 2 + jitterZ;
      
      result.push({
        label: loc,
        x,
        z,
        value: averagePrice,
        roi: Number(roi.toFixed(1)),
        count
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Heatmap API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch heatmap data" }, { status: 500 });
  }
}
