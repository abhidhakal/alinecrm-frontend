import { useState, useEffect } from 'react';
import { Howl, Howler } from 'howler';

const SOUNDS_CONFIG = [
  {
    id: 'rain',
    title: 'Rain',
    icon: '/icons/ambient-sounds/rain.svg',
    url: 'https://res.cloudinary.com/dqsp5bwo4/video/upload/v1766687922/calm-rain_jbbrli.mp3' 
  },
  {
    id: 'forest',
    title: 'Forest',
    icon: '/icons/ambient-sounds/nature.svg',
    url: 'https://res.cloudinary.com/dqsp5bwo4/video/upload/v1766687913/forest-nature_qkahmz.mp3'
  },
  {
    id: 'waves',
    title: 'Waves',
    icon: '/icons/ambient-sounds/waves.svg',
    url: 'https://res.cloudinary.com/dqsp5bwo4/video/upload/v1766687915/ocean-waves_q2ltdy.mp3'
  },
  {
    id: 'coffee',
    title: 'Cafe',
    icon: '/icons/ambient-sounds/cafe.svg',
    url: 'https://res.cloudinary.com/dqsp5bwo4/video/upload/v1766687913/cafe_dkbhrm.mp3'
  },
  {
    id: 'fire',
    title: 'Campfire',
    icon: '/icons/ambient-sounds/campfire.svg',
    url: 'https://res.cloudinary.com/dqsp5bwo4/video/upload/v1766687914/campfire_lhse4o.mp3'
  },
  {
    id: 'thunder',
    title: 'Thunder',
    icon: '/icons/ambient-sounds/thunder-rain.svg',
    url: 'https://res.cloudinary.com/dqsp5bwo4/video/upload/v1766687916/thunder-rain_mwroe6.mp3'
  },
  {
    id: 'night',
    title: 'Night',
    icon: '/icons/ambient-sounds/night.svg',
    url: 'https://res.cloudinary.com/dqsp5bwo4/video/upload/v1766687914/night_kgqabf.mp3'
  },
  {
    id: 'stream',
    title: 'Stream',
    icon: '/icons/ambient-sounds/stream.svg',
    url: 'https://res.cloudinary.com/dqsp5bwo4/video/upload/v1766687918/stream_rym023.mp3'
  },
  {
    id: 'brown_noise',
    title: 'Brown Noise',
    icon: '/icons/ambient-sounds/brown-noise.svg',
    url: 'https://res.cloudinary.com/dqsp5bwo4/video/upload/v1766687916/brown-noise_n7tivn.mp3'
  }
];

interface SoundState {
  howl: Howl;
  volume: number;
}

interface SoundMixerProps {
  zenMode?: boolean;
}

export default function SoundMixer({ zenMode = false }: SoundMixerProps) {
  const [sounds, setSounds] = useState<Record<string, SoundState>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Howler sounds on mount
  useEffect(() => {
    // Cleanup previous sounds if any
    Object.values(sounds).forEach(s => s.howl.unload());

    const newSounds: Record<string, SoundState> = {};

    SOUNDS_CONFIG.forEach((config) => {
      // Default Rain to 50% volume so it's not silent initially
      const initialVolume = config.id === 'rain' ? 0.5 : 0;
      
      newSounds[config.id] = {
        howl: new Howl({
          src: [config.url],
          format: ['mp3'],
          loop: true,
          volume: initialVolume, 
          preload: true,
          // html5: true, // Commented out to use Web Audio API for better mixing and gapless looping
          onplayerror: () => {
            // Fallback: try to unlock audio context when autoplay is blocked
            Howler.ctx?.resume();
          }
        }),
        volume: initialVolume
      };
    });

    setSounds(newSounds);
    setIsLoaded(true);

    // Cleanup on unmount
    return () => {
      Object.values(newSounds).forEach(s => s.howl.unload());
    };
  }, [SOUNDS_CONFIG.length]); // Re-run if config length changes

  const togglePlay = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    // Resume AudioContext if it was suspended (common browser policy)
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }

    Object.keys(sounds).forEach((key) => {
      const sound = sounds[key];
      if (newIsPlaying && sound.volume > 0) {
        if (!sound.howl.playing()) {
          sound.howl.play();
        }
        sound.howl.fade(0, sound.volume, 1000);
      } else {
        sound.howl.fade(sound.howl.volume(), 0, 1000);
        setTimeout(() => {
          if (!newIsPlaying) {
            sound.howl.pause();
          }
        }, 1000);
      }
    });
  };

  const handleVolumeChange = (id: string, newVolumeInt: number) => {
    const newVolume = newVolumeInt / 100;
    
    setSounds(prev => {
      const sound = prev[id];
      if (!sound) {
        return prev;
      }

      // Update Howler instance immediately
      if (isPlaying) {
        if (newVolume > 0 && !sound.howl.playing()) {
          sound.howl.play();
          sound.howl.fade(0, newVolume, 500);
        } else if (newVolume === 0) {
          sound.howl.fade(sound.howl.volume(), 0, 500);
          setTimeout(() => {
             if (sound.howl.volume() === 0) sound.howl.pause();
          }, 500);
        } else {
          sound.howl.volume(newVolume);
        }
      } else {
        // Even if not playing, update the volume property so it plays at correct volume when started
        sound.howl.volume(newVolume);
      }

      return {
        ...prev,
        [id]: { ...sound, volume: newVolume }
      };
    });
  };

  if (!isLoaded) return <div className={`p-4 ${zenMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading audio engine...</div>;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition-colors duration-500 ${
      zenMode 
        ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
        : 'border-gray-200 bg-white'
    }`}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className={`text-base font-semibold transition-colors ${zenMode ? 'text-gray-100' : 'text-gray-900'}`}>Ambient Mixer</h2>
          <p className={`text-xs transition-colors ${zenMode ? 'text-gray-400' : 'text-gray-500'}`}>Mix sounds to create your focus zone</p>
        </div>
        <button
          onClick={togglePlay}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
            isPlaying 
              ? (zenMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800')
              : (zenMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-900 hover:bg-gray-200')
          }`}
        >
          {isPlaying ? (
            <img src="/icons/pause-icon.svg" alt="Pause" className={`h-4 w-4 ${zenMode ? '' : 'invert brightness-0 filter'}`} />
          ) : (
            <img src="/icons/play-icon.svg" alt="Play" className={`h-4 w-4 ml-0.5 ${zenMode ? 'invert brightness-0 filter' : ''}`} />
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {SOUNDS_CONFIG.map((config) => (
          <div key={config.id} className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all hover:shadow-sm ${
            zenMode 
              ? 'bg-white/5 hover:bg-white/10' 
              : 'bg-gray-50 hover:bg-gray-100'
          }`}>
            {config.icon.startsWith('/') ? (
              <img src={config.icon} alt={config.title} className={`h-8 w-8 ${zenMode ? 'invert brightness-0 filter' : ''}`} />
            ) : (
              <span className="text-3xl">{config.icon}</span>
            )}
            <span className={`text-sm font-semibold transition-colors ${zenMode ? 'text-gray-200' : 'text-gray-900'}`}>{config.title}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={(sounds[config.id]?.volume || 0) * 100}
              onChange={(e) => handleVolumeChange(config.id, parseInt(e.target.value))}
              className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg accent-gray-900"
              style={{
                background: `linear-gradient(to right, ${zenMode ? '#fff' : '#111827'} ${(sounds[config.id]?.volume || 0) * 100}%, ${zenMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} ${(sounds[config.id]?.volume || 0) * 100}%)`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
