import { useState } from 'react'
import Header from './components/Header';

function Landing() {
  return (
    <div className="w-full min-h-screen bg-cover bg-center" style={{
      backgroundImage: "url('/src/assets/gradient.png')"
    }}>
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-white text-5xl font-bold">Welcome</h1>
      </div>
    </div>
  );
}

export default Landing
