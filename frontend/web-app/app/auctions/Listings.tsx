'use client'

import { Auction } from "@/types";
import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionActions";
import { useEffect, useState } from "react";

export default function Listings() {
  const [auction, setAuctions] = useState<Auction[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);


  useEffect(() => {
    getData(pageNumber).then(data => {
      setAuctions(data.results);
      setPageCount(data.pageCount);
    })
  }, [pageNumber]);

  if  (auction.length === 0) return <h3>Loading...</h3>

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {auction.map((auction: Auction) => (
          <AuctionCard
            key={auction.id}
            auction={auction}
          />
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <AppPagination pageChanged={setPageNumber} currentPage={pageNumber} pageCount={pageCount} />
      </div>
    </>
  )
}