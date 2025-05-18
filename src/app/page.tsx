'use client';

import dynamic from "next/dynamic";

const Sketch = dynamic(() => import('./components/sketch'), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h1 className="flex w-full justify-center mx-auto">p5.js + Next.js</h1>
      <Sketch />
    </div>
  );
}