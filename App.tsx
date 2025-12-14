import React, { useState, useEffect } from 'react';
import { UserProfile, PortfolioDirection, GenerationState } from './types';
import InputSection from './components/InputSection';
import ConceptBoard from './components/ConceptBoard';
import SlideDeck from './components/SlideDeck';
import { generatePortfolioPlan, generateMoodImage } from './services/geminiService';
import { Loader2 } from 'lucide-react';

// Default values based on the prompt
const DEFAULT_PROFILE: UserProfile = {
  interests: "Rock bands, Classical music, I like everything beautiful and melancholic.",
  styleIcons: "Tang Wei, Gong Li",
  fashion: "YSL style (sharp, elegant, black)",
  movies: "Aftersun, Summer 1993",
  art: "Painter: Vermeer. Calligraphy: Xu Wei, Ni Zan.",
  photographyStyle: "Quiet, still, humanistic care."
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [direction, setDirection] = useState<PortfolioDirection | null>(null);
  const [moodImage, setMoodImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationState>(GenerationState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStatus(GenerationState.ANALYZING);
    setErrorMsg(null);
    setDirection(null);
    setMoodImage(null);

    try {
      // Step 1: Generate Text Structure
      const generatedDirection = await generatePortfolioPlan(profile);
      setDirection(generatedDirection);
      setStatus(GenerationState.GENERATING_IMAGES);

      // Step 2: Generate Mood Image
      const image = await generateMoodImage(generatedDirection);
      setMoodImage(image);
      
      setStatus(GenerationState.COMPLETE);
    } catch (err) {
      console.error(err);
      setStatus(GenerationState.ERROR);
      setErrorMsg("Failed to curate portfolio. Please check your API key or try again.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 selection:bg-stone-700 selection:text-white flex flex-col">
      
      {/* Header */}
      <header className="py-8 border-b border-stone-900 sticky top-0 z-50 bg-stone-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="font-serif text-2xl tracking-widest text-white italic">L'ESTHÉTIQUE</h1>
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Portfolio Curator</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full">
        
        {/* Intro / Input Section */}
        {status === GenerationState.IDLE && (
           <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
             <InputSection 
               profile={profile} 
               setProfile={setProfile} 
               onGenerate={handleGenerate}
               state={status}
             />
           </div>
        )}

        {/* Loading State */}
        {(status === GenerationState.ANALYZING || status === GenerationState.GENERATING_IMAGES) && (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
             <Loader2 className="animate-spin text-stone-400" size={48} />
             <div className="text-center space-y-2">
               <p className="font-serif text-xl italic text-stone-200">
                 {status === GenerationState.ANALYZING ? "Analyzing aesthetic influences..." : "Synthesizing visual identity..."}
               </p>
               <p className="text-xs uppercase tracking-widest text-stone-600">
                 Consulting Vermeer & YSL archives
               </p>
             </div>
          </div>
        )}

        {/* Results */}
        {(status === GenerationState.COMPLETE || (direction && status !== GenerationState.IDLE)) && direction && (
          <div className="w-full space-y-24 py-12">
            
            {/* Concept Section */}
            <ConceptBoard data={direction} moodImage={moodImage} />

            {/* Slide Deck Section */}
            <section className="border-t border-stone-900 bg-gradient-to-b from-stone-950 to-stone-900 py-12">
               <SlideDeck data={direction} />
            </section>

            {/* Reset / Action Footer */}
            <div className="container mx-auto px-6 pb-24 flex justify-center">
               <button 
                 onClick={() => setStatus(GenerationState.IDLE)}
                 className="text-xs uppercase tracking-widest text-stone-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
               >
                 Curate New Direction
               </button>
            </div>
          </div>
        )}

        {status === GenerationState.ERROR && (
           <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
             <p className="text-red-400 font-serif italic text-xl">{errorMsg}</p>
             <button 
                 onClick={() => setStatus(GenerationState.IDLE)}
                 className="px-6 py-2 border border-stone-700 text-stone-400 hover:text-white hover:border-white transition-all text-xs uppercase tracking-widest"
               >
                 Try Again
             </button>
           </div>
        )}

      </main>

      <footer className="py-6 text-center border-t border-stone-900">
        <p className="text-[10px] text-stone-700 uppercase tracking-widest">
          Designed with Gemini • React • Tailwind
        </p>
      </footer>
    </div>
  );
};

export default App;
