import React from 'react';
import { UserProfile, GenerationState } from '../types';
import { Sparkles } from 'lucide-react';

interface InputSectionProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onGenerate: () => void;
  state: GenerationState;
}

const InputSection: React.FC<InputSectionProps> = ({ profile, setProfile, onGenerate, state }) => {
  
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = state !== GenerationState.IDLE && state !== GenerationState.COMPLETE && state !== GenerationState.ERROR;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-8 border border-stone-800 bg-stone-900/50 backdrop-blur-sm shadow-2xl">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif italic text-stone-100">Define Your Essence</h2>
        <p className="text-stone-400 text-sm font-light uppercase tracking-widest">
          Input your influences to curate your visual identity
        </p>
      </div>

      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-stone-500">Music & Atmosphere</label>
            <textarea
              className="w-full bg-stone-950 border-b border-stone-700 p-2 text-stone-300 focus:outline-none focus:border-stone-400 transition-colors h-20 resize-none font-serif"
              value={profile.interests}
              onChange={(e) => handleChange('interests', e.target.value)}
              placeholder="e.g., Rock bands, Classical music, beauty in sadness..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-stone-500">Muses & Icons</label>
            <textarea
              className="w-full bg-stone-950 border-b border-stone-700 p-2 text-stone-300 focus:outline-none focus:border-stone-400 transition-colors h-20 resize-none font-serif"
              value={profile.styleIcons}
              onChange={(e) => handleChange('styleIcons', e.target.value)}
              placeholder="e.g., Tang Wei, Gong Li..."
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-stone-500">Fashion & Aesthetics</label>
            <input
              type="text"
              className="w-full bg-stone-950 border-b border-stone-700 p-2 text-stone-300 focus:outline-none focus:border-stone-400 transition-colors font-serif"
              value={profile.fashion}
              onChange={(e) => handleChange('fashion', e.target.value)}
              placeholder="e.g., YSL style..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-stone-500">Cinema</label>
            <input
              type="text"
              className="w-full bg-stone-950 border-b border-stone-700 p-2 text-stone-300 focus:outline-none focus:border-stone-400 transition-colors font-serif"
              value={profile.movies}
              onChange={(e) => handleChange('movies', e.target.value)}
              placeholder="e.g., Aftersun, Summer 1993..."
            />
          </div>
        </div>

         {/* Row 3 */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-stone-500">Art (Painting & Calligraphy)</label>
            <input
              type="text"
              className="w-full bg-stone-950 border-b border-stone-700 p-2 text-stone-300 focus:outline-none focus:border-stone-400 transition-colors font-serif"
              value={profile.art}
              onChange={(e) => handleChange('art', e.target.value)}
              placeholder="e.g., Vermeer, Xu Wei, Ni Zan..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-stone-500">Photography Style</label>
            <input
              type="text"
              className="w-full bg-stone-950 border-b border-stone-700 p-2 text-stone-300 focus:outline-none focus:border-stone-400 transition-colors font-serif"
              value={profile.photographyStyle}
              onChange={(e) => handleChange('photographyStyle', e.target.value)}
              placeholder="e.g., Quiet, humanistic, serene..."
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-center">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`
            group relative px-8 py-3 bg-stone-200 text-stone-950 font-sans uppercase tracking-widest text-xs font-bold
            hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-3 overflow-hidden
          `}
        >
          <span className="relative z-10">{isLoading ? 'Curating...' : 'Generate Portfolio Direction'}</span>
          <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
          {!isLoading && <Sparkles size={14} className="relative z-10" />}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
