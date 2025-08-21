'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  endDate: string
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="flex gap-4 text-black">
      <div className="bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{timeLeft.days}</span>
        <span className="text-xs">Days</span>
      </div>
      <div className="bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{timeLeft.hours}</span>
        <span className="text-xs">Hours</span>
      </div>
      <div className="bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{timeLeft.minutes}</span>
        <span className="text-xs">Min</span>
      </div>
      <div className="bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{timeLeft.seconds}</span>
        <span className="text-xs">Sec</span>
      </div>
    </div>
  )
}