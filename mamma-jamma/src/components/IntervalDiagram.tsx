'use client';

import { useState } from 'react';
import KeySelector from './KeySelector';
import DiagramVisualization from './DiagramVisualization';

// Define the musical keys
const KEYS = [
  'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 
  'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'
];

export default function IntervalDiagram() {
  const [selectedKey, setSelectedKey] = useState('C');

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6">
        <KeySelector keys={KEYS} selectedKey={selectedKey} onKeyChange={setSelectedKey} />
      </div>
      <div className="aspect-square p-4 flex items-center justify-center">
        <DiagramVisualization selectedKey={selectedKey} />
      </div>
    </div>
  );
}