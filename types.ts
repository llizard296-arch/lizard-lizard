export interface UserProfile {
  interests: string;
  styleIcons: string;
  fashion: string;
  movies: string;
  art: string;
  photographyStyle: string;
}

export interface PortfolioSlide {
  slideNumber: number;
  title: string;
  layout: 'Title' | 'FullImage' | 'Split' | 'Grid' | 'TextFocused';
  contentGuide: string;
  visualPrompt: string;
}

export interface PortfolioDirection {
  title: string;
  concept_statement: string;
  aesthetic_keywords: string[];
  color_palette_description: string;
  slides: PortfolioSlide[];
}

export enum GenerationState {
  IDLE,
  ANALYZING,
  GENERATING_IMAGES,
  COMPLETE,
  ERROR
}