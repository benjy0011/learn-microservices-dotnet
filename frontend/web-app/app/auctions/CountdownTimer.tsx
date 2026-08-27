'use client';

import { useBidStore } from "@/hooks/useBidStore";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from 'react';
import Countdown, { zeroPad } from 'react-countdown';

const subscribe = () => () => {};

const renderer = (
  { days, hours, minutes, seconds, completed }
  : { days: number, hours: number, minutes: number, seconds: number, completed: boolean }
) => {
  return (
    <div className={`
      border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center
      ${completed ? `bg-red-600` : (days === 0 && hours < 10) ? 'bg-amber-600' : 'bg-green-600'}
    `}>
      {completed ? (
        <span>Auction finished</span>
      ) : (
        <span suppressHydrationWarning={false}>
          {days}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      )}
    </div>
  )
};

const CountdownSkeleton = () => (
  <div className="rounded-lg flex h-9 bg-gray-200 opacity-60 animate-pulse w-22" />
)

type Props = {
  auctionEnd: string;
}

export default function CountdownTimer( { auctionEnd } : Props ) {
  const isMounted = useSyncExternalStore(subscribe, () => true, () => false);

  const setOpen = useBidStore(state => state.setOpen);
  const pathname = usePathname();

  function auctionFinished() {
    if (pathname.startsWith('/auctions/details')) {
      setOpen(false);
    }
  }

  return (
    <div>
      {isMounted ? 
        <Countdown date={auctionEnd} renderer={renderer} onComplete={auctionFinished} />
        : <CountdownSkeleton />
      }
    </div>
  )
}