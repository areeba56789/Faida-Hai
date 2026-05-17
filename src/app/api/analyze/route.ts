import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/utils/supabase/server";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!ai) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    const { city, floors, area } = await req.json();

    if (!city || !floors || !area) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Generate an embedding for the user's query
    const queryText = `Real estate property in ${city}, ${floors} floors, ${area} sqft.`;
    const embedResponse = await ai.models.embedContent({
      model: "models/embedding-001",
      contents: queryText,
    });
    
    if (!embedResponse.embeddings || embedResponse.embeddings.length === 0) {
      throw new Error("Failed to generate embedding for the query.");
    }
    const queryEmbedding = embedResponse.embeddings[0].values;

    // 2. Perform Similarity Search in Supabase (RAG)
    const { data: matchedProperties, error: matchError } = await supabase.rpc("match_properties", {
      query_embedding: queryEmbedding,
      match_threshold: 0.5, // 50% similarity threshold
      match_count: 5 // Get top 5 properties
    });

    if (matchError) {
      console.error("Vector search failed:", matchError);
    }

    // 3. Construct Context from Matched Properties
    let contextData = "No specific market data found for this exact query.";
    if (matchedProperties && matchedProperties.length > 0) {
      contextData = matchedProperties.map((p: any) => 
        `- ${p.title} in ${p.location} (${p.property_type}): ${p.area_sqft} sqft, ${p.bedrooms} beds. Listed at AED ${p.price}.`
      ).join("\n");
    }

    // 4. Send Grounded Prompt to Gemini
    const prompt = `You are an Elite Real Estate Analyst evaluating a property in ${city}, Pakistan.
The target property has ${floors} floors and a total area of ${area} sqft (consider mapping this to Marla or Kanal if applicable).

Here is the REAL LIVE MARKET DATA from our database containing neighborhood comparables from Zameen:
=== NEIGHBORHOOD COMPARABLES ===
${contextData}
================================

Using the neighborhood comparables provided above as your factual baseline, estimate the value of the target property.
Since the data might be sparse, extrapolate logically based on general local trends and the comparables provided.

IMPORTANT: All monetary values should be expressed in Pakistani Rupees (PKR), formatted smartly (e.g., "2.5 Crore" or "45 Lacs").

You must respond with a strictly formatted JSON object (no markdown, no code blocks) matching this schema exactly:
{
  "estimatedValue": "string (e.g. 4.2 Crore PKR)",
  "projectedROI": "number (percentage, e.g. 14.5)",
  "strengths": ["string", "string", "string"],
  "risks": ["string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    const parsedData = JSON.parse(resultText);

    // Save to Supabase History
    const { error: dbError } = await supabase.from("property_analysis").insert({
      user_id: user.id,
      city: city,
      floors: parseInt(floors),
      area: parseFloat(area),
      estimated_value: parseFloat(parsedData.estimatedValue),
      projected_roi: parseFloat(parsedData.projectedROI),
      key_strengths: parsedData.strengths,
      risk_factors: parsedData.risks,
    });

    if (dbError) {
      console.error("Failed to save analysis to DB:", dbError);
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze property" }, { status: 500 });
  }
}
