import { create } from 'zustand';

// Define the chord type
type Chord = {
  name: string;
  position: { x: number; y: number };
  type: 'major' | 'minor' | 'diminished' | 'tonic';
};

// Define the interval connection type
type IntervalConnection = {
  from: string;
  to: string;
  intervalType: '2nd' | '3rd' | '4th';
  emotion: string;
};

interface DiagramState {
  selectedKey: string;
  diatonicChords: Chord[];
  intervalConnections: IntervalConnection[];
  setSelectedKey: (key: string) => void;
  generateDiatonicChords: (key: string) => void;
}

export const useDiagramStore = create<DiagramState>((set) => ({
  selectedKey: 'C',
  diatonicChords: [],
  intervalConnections: [],
  
  setSelectedKey: (key) => {
    set({ selectedKey: key });
    // We'll implement this function when we build out the D3 visualization
    set((state) => {
      state.generateDiatonicChords(key);
      return state;
    });
  },
  
  generateDiatonicChords: (key) => {
    // This is where we'll generate the diatonic chords for the selected key
    // For now, just a placeholder
    set({ 
      diatonicChords: [], 
      intervalConnections: [] 
    });
  },
}));