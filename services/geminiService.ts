import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateDescription = async (productName: string, imageBase64: string, imageMimeType: string): Promise<string> => {
  try {
    const textPart = {
      text: `Generate a compelling and brief e-commerce product description for a South African marketplace. The product is named "${productName}". 
      Focus on its key features and benefits for a local customer. Keep it under 60 words. 
      Do not use markdown or formatting. Just provide plain text.`,
    };

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: imageMimeType,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Failed to generate AI description. Please try again.");
  }
};
