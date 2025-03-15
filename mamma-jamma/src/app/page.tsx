import IntervalDiagram from '@/components/IntervalDiagram';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-between w-full max-w-4xl mb-8">
        <h1 className="w-full text-3xl font-bold mb-8">mamma jamma</h1>
        <ModeToggle />
      </div>
      <IntervalDiagram />
    </main>
  );
}