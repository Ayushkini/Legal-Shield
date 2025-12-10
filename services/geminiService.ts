import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Tone } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-pro-preview";

export const analyzeLegalDocument = async (
  base64Data: string,
  mimeType: string
): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `You are an expert legal aide. Analyze the attached document.
            Identify:
            1. Sender Name.
            2. The Demand (Money, Eviction, etc.).
            3. The Jurisdiction (State/Region mentioned in header/footer). If unknown, assume "Federal/General".
            4. Threat Level.
            5. 3 Logical Flaws or procedural errors (e.g., missing dates, vague charges, FDCPA violations).
            
            Return JSON.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sender: { type: Type.STRING },
            demand: { type: Type.STRING },
            jurisdiction: { type: Type.STRING, description: "The state or country laws applicable (e.g., California, Texas)" },
            threatLevel: { 
              type: Type.STRING, 
              enum: ["Low", "Medium", "High", "Immediate Action Required"] 
            },
            flaws: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List exactly 3 distinct flaws."
            }
          },
          required: ["sender", "demand", "jurisdiction", "threatLevel", "flaws"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const generateDefenseLetter = async (
  analysis: AnalysisResult,
  tone: Tone
): Promise<string> => {
  try {
    const prompt = `
      You are 'Legal Shield'. Write a formal response letter.
      
      Details:
      - Recipient: ${analysis.sender}
      - Demand: ${analysis.demand}
      - Jurisdiction: ${analysis.jurisdiction}
      - Tone: ${tone}
      
      Key Arguments to use:
      ${analysis.flaws.map(f => `- ${f}`).join('\n')}
      
      CRITICAL INSTRUCTIONS:
      1. Cite specific laws or codes relevant to ${analysis.jurisdiction} where possible (e.g., "FDCPA Section 809" or specific State Civil Codes).
      2. If the tone is 'Diplomatic', be cooperative but firm on rights.
      3. If 'Firm', strictly demand proof.
      4. If 'Aggressive', warn of legal escalation if harassment continues.
      5. Use standard business letter formatting with placeholders like [Your Name].
      6. No markdown formatting (*, #). Plain text only.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    let text = response.text || "Failed to generate letter.";
    
    text = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/^\#+\s/gm, '')
      .replace(/^\*\s/gm, '• ');

    return text;
  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};