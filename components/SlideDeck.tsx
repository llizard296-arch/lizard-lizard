import React from 'react';
import { PortfolioDirection, PortfolioSlide } from '../types';
import { Monitor, Image as ImageIcon, AlignLeft, Grid, Maximize } from 'lucide-react';

interface SlideDeckProps {
  data: PortfolioDirection;
}

const SlideCard: React.FC<{ slide: PortfolioSlide }> = ({ slide }) => {
  // Determine icon based on layout
  const LayoutIcon = () => {
    switch (slide.layout) {
      case 'Title': return <Monitor size={16} />;
      case 'FullImage': return <Maximize size={16} />;
      case 'Split': return <AlignLeft size={16} />;
      case 'Grid': return <Grid size={16} />;
      default: return <ImageIcon size={16} />;
    }
  };

  return (
    <div className="min-w-[300px] md:min-w-[400px] h-[500px] bg-white text-stone-900 p-6 flex flex-col justify-between shadow-lg border border-stone-200 snap-center mx-4 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
      
      {/* Slide Header */}
      <div className="flex justify-between items-center text-xs uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-2 mb-4">
        <span>Slide {slide.slideNumber.toString().padStart(2, '0')}</span>
        <LayoutIcon />
      </div>

      {/* Content Simulation */}
      <div className="flex-grow flex flex-col justify-center space-y-4">
        <h3 className="font-serif text-2xl italic text-stone-800">
          {slide.title}
        </h3>
        
        <div className="text-sm font-sans text-stone-500 leading-relaxed border-l-2 border-stone-300 pl-3">
          <p className="uppercase text-[10px] font-bold tracking-wider mb-1 text-stone-400">Content Direction</p>
          {slide.contentGuide}
        </div>

        <div className="bg-stone-100 p-3 text-xs text-stone-500 italic font-serif">
          <span className="font-bold not-italic text-[10px] uppercase text-stone-400 block mb-1">Visual Cue</span>
          "{slide.visualPrompt}"
        </div>
      </div>

      {/* Abstract Footer */}
      <div className="pt-4 border-t border-stone-100 flex justify-between items-end">
         <div className="w-8 h-8 bg-stone-900 rounded-full opacity-10"></div>
         <span className="text-[10px] uppercase tracking-widest text-stone-300">{slide.layout} Layout</span>
      </div>
    </div>
  );
};

const SlideDeck: React.FC<SlideDeckProps> = ({ data }) => {
  return (
    <div className="w-full py-12 animate-in fade-in duration-1000 slide-in-from-bottom-10">
      <div className="flex justify-between items-end px-8 mb-8">
        <div>
          <h2 className="text-stone-400 text-xs uppercase tracking-[0.2em] mb-2">The Sequence</h2>
          <p className="font-serif italic text-xl text-stone-200">Portfolio Flow</p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-stone-500 text-xs">{data.slides.length} Slides Generated</p>
        </div>
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto pb-12 pt-4 px-4 snap-x mandatory scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-800">
        {data.slides.map((slide) => (
          <SlideCard key={slide.slideNumber} slide={slide} />
        ))}
        {/* Spacer for end of scroll */}
        <div className="min-w-[50px]"></div>
      </div>
    </div>
  );
};

export default SlideDeck;
