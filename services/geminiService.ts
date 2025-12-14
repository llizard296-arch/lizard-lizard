import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, PortfolioDirection } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePortfolioPlan = async (profile: UserProfile): Promise<PortfolioDirection> => {
  const ai = getClient();
  
  const systemInstruction = `
    You are a world-class Art Director and Portfolio Curator for high-end fashion and fine art photographers.
    Your specialty is blending Eastern and Western aesthetics: The melancholy of "Mono no Aware", the emptiness of Ni Zan, the light of Vermeer, and the chic edge of YSL.
    
    Your goal is to create a Portfolio Direction and Slide Outline for a photographer based on their specific stylistic influences.
    The tone of your writing should be poetic, sophisticated, minimal, and deeply humanistic.
    
    Construct a JSON response.
  `;

  const prompt = `
    Analyze this photographer's profile:
    - Interests: ${profile.interests}
    - Icons: ${profile.styleIcons} (Note: Tang Wei, Gong Li imply depth, emotion, cinema).
    - Fashion: ${profile.fashion} (Note: YSL implies structure, black, androgyny, elegance).
    - Movies: ${profile.movies} (Note: Aftersun, Summer 1993 imply nostalgia, subtle grief, sun-drenched melancholy).
    - Art: ${profile.art} (Note: Vermeer = Light; Xu Wei/Ni Zan = Ink, wildness, isolation).
    - Photo Style: ${profile.photographyStyle}

    Create a "Portfolio Direction" that unifies these diverse elements into a singular artistic identity.
    Then, outline a 8-10 slide presentation structure for their portfolio.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A poetic title for the portfolio (e.g., 'Ink & Light', 'The Blue Hour')" },
          concept_statement: { type: Type.STRING, description: "A 100-word sophisticated artist statement connecting rock, calligraphy, and YSL aesthetics." },
          aesthetic_keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 words describing the vibe." },
          color_palette_description: { type: Type.STRING, description: "Description of colors (e.g., 'Charcoal, Vermeer Blue, Old Parchment')." },
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                slideNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                layout: { type: Type.STRING, enum: ['Title', 'FullImage', 'Split', 'Grid', 'TextFocused'] },
                contentGuide: { type: Type.STRING, description: "What text or specific content goes here." },
                visualPrompt: { type: Type.STRING, description: "A prompt describing the visual layout or mood image for this slide." }
              },
              required: ['slideNumber', 'title', 'layout', 'contentGuide', 'visualPrompt']
            }
          }
        },
        required: ['title', 'concept_statement', 'aesthetic_keywords', 'color_palette_description', 'slides']
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini.");
  }

  return JSON.parse(response.text) as PortfolioDirection;
};

export const generateMoodImage = async (direction: PortfolioDirection): Promise<string | null> => {
  const ai = getClient();
  
  // Synthesize a prompt that captures the essence of the direction
  const imagePrompt = `
    An abstract, artistic mood board image for a photography portfolio.
    Style mixture: ${direction.aesthetic_keywords.join(", ")}.
    
    Visual Elements:
    - Lighting reminiscent of Vermeer (soft, window light).
    - Textures reminiscent of Xu Wei and Ni Zan (ink wash, rough paper, negative space).
    - Fashion attitude of Yves Saint Laurent (sharp, black, elegant).
    - Cinematic grain like the movie Aftersun.
    
    Composition: Minimalist, wide angle, serene, highly atmospheric.
    Colors: ${direction.color_palette_description}.
    High quality, 4k, artistic masterpiece.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: imagePrompt }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null; // Fail gracefully
  }
};
