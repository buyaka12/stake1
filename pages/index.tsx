// pages/index.tsx

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { x: 0, y: 1 },
  { x: 1, y: 1.5 },
  { x: 2, y: 2 },
  { x: 3, y: 2.3 },
  { x: 4, y: 2.7 },
  { x: 5, y: 3 },
  { x: 6, y: 2.5 },
  { x: 7, y: 2.8 },
  { x: 8, y: 3.2 },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="text-white text-3xl font-bold mb-6">Stake Slide Clone</h1>
      
      <div className="w-full max-w-3xl h-[400px] bg-black rounded-xl shadow-inner p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="x" stroke="#888" />
            <YAxis stroke="#888" />
            <Line type="monotone" dataKey="y" stroke="#00FF00" strokeWidth={2} dot={false} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
