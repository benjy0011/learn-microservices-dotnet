'use client'

import { Auction, PageResults } from "@/types";
import AuctionCard from "./AuctionCard";
import AppPagination from "../components/AppPagination";
import { getData } from "../actions/auctionActions";
import { useEffect, useState } from "react";
import Filters from "./Filters";
import { useParamsStore } from "@/hooks/useParamStore";
import { useShallow } from "zustand/shallow";
import qs from "query-string";
import EmptyFilter from "../components/EmptyFilter";
import { useAuctionStore } from "@/hooks/useAuctionStore";

export default function Listings() {
  const [loading, setLoading] = useState(true);
  const params = useParamsStore(
    useShallow(state => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
      filterBy: state.filterBy,
      seller: state.seller,
      winner: state.winner,
    }))
  );

  const data = useAuctionStore(useShallow(state => ({
    auctions: state.auctions,
    totalCount: state.pageCount,
    pageCount: state.pageCount,
  })));
  const setData = useAuctionStore(state => state.setData);

  const setParams = useParamsStore(state => state.setParams);
  const url = qs.stringifyUrl({ url: '', query: params }, { skipEmptyString: true });

  function setPageNumber(pageNumber: number) {
    setParams({pageNumber});
  };

  useEffect(() => {
    getData(url).then(data => {
      setData(data);
      setLoading(false);
    })
  }, [url, setData]);

  if (loading) return <h3>Loading...</h3>

  return (
    <>
      <Filters />

      {data.totalCount === 0 ? (
        <EmptyFilter showReset />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {data && data.auctions.map((auction) => (
              <AuctionCard
                key={`${auction.id}-${params.orderBy}`}
                auction={auction}
              />
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <AppPagination pageChanged={setPageNumber} currentPage={params.pageNumber} pageCount={data.pageCount} />
          </div>
        </>
      )}
    </>
  )
}