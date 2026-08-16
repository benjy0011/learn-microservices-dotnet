'use client';

import { useParamsStore } from "@/hooks/useParamStore";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineCar } from "react-icons/ai";

export default function Logo() {
  const router = useRouter();
  const pathname = usePathname();
  const reset = useParamsStore(state => state.reset);

  function handleReset() {
    if (pathname !== '/') router.push('/');
    reset();
  }

  return (
    <div onClick={handleReset} className="cursor-pointer flex items-center gap-2 text-2xl font-bold text-red-500">
      <AiOutlineCar size={34} />
      <div>Carsties Auctions</div>
    </div>
  )
}