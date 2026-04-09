'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  temp: number
  condition: string
  icon: string
  humidity: number
  wind: number
  location: string
}

const ICON_MAP: Record<string, string> = {
  'Sunny': '☀️', 'Clear': '🌙', 'Partly cloudy': '⛅', 'Cloudy': '☁️',
  'Overcast': '☁️', 'Mist': '🌫️', 'Fog': '🌫️', 'Light rain': '🌦️',
  'Heavy Rain': '🌧️', 'Thunder': '⛈️', 'Snow': '❄️', 'Sleet': '🌨️',
  'Light drizzle': '🌧️', 'Blowing snow': '🌨️',
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://wttr.in/Shanghai?format=j1')
      .then(r => r.json())
      .then(data => {
        const curr = data.current_condition[0]
        const desc = curr.weatherDesc[0].value
        setWeather({
          temp: Math.round((parseInt(curr.temp_C) * 9) / 5 + 32),
          condition: desc,
          icon: ICON_MAP[desc] ?? '🌡️',
          humidity: parseInt(curr.humidity),
          wind: parseInt(curr.windspeedKmph),
          location: '上海',
        })
        setLoading(false)
      })
      .catch(() => {
        setWeather({ temp: 72, condition: 'Unknown', icon: '🌡️', humidity: 50, wind: 10, location: '上海' })
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-700 rounded w-20" />
          <div className="h-8 bg-slate-700 rounded w-16" />
          <div className="h-3 bg-slate-700 rounded w-28" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-sky-900/60 to-slate-800/60 border border-slate-600 p-5 hover:border-slate-500 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs mb-1">{weather?.location}</p>
          <p className="text-5xl font-thin text-white">{weather?.temp}°</p>
          <p className="text-slate-300 text-sm mt-1">{weather?.condition}</p>
        </div>
        <div className="text-5xl">{weather?.icon}</div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span>💧</span><span>{weather?.humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span>🌬️</span><span>{weather?.wind} km/h</span>
        </div>
      </div>
    </div>
  )
}
