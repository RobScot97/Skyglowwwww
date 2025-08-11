'use client';

import { NextSunEvent } from '@/lib/types';

interface SunEventCardProps {
  event: NextSunEvent;
}

export default function SunEventCard({ event }: SunEventCardProps) {
  const isSunrise = event.type === 'sunrise';
  
  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6 text-white
      ${isSunrise 
        ? 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600' 
        : 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600'
      }
    `}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className={`
          absolute top-4 right-4 w-20 h-20 rounded-full
          ${isSunrise ? 'bg-yellow-300' : 'bg-orange-300'}
        `}></div>
        <div className={`
          absolute bottom-0 left-0 w-32 h-16 rounded-full
          ${isSunrise ? 'bg-pink-300' : 'bg-red-300'}
        `}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">
            {isSunrise ? '🌅' : '🌇'}
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Prossim{isSunrise ? 'a Alba' : 'o Tramonto'}
            </h3>
            <p className="text-white/80 text-sm">
              {event.countdown !== 'Passato' ? `Tra ${event.countdown}` : 'Passato'}
            </p>
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold mb-1">
              {event.time}
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: event.score.color }}
              ></div>
              <span className="text-sm font-medium">
                {event.score.label} ({event.score.score}%)
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold opacity-20">
              {event.score.score}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

