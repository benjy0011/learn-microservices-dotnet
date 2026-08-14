'use client';

import { useParamsStore } from "@/hooks/useParamStore";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { debounce } from "../utils/debounce";

export default function Search() {
  const setParams = useParamsStore(state => state.setParams);
  const searchTerm = useParamsStore(state => state.searchTerm);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement| null>(null);

  useEffect(() => {
    if (inputRef.current && searchTerm === '') {
      inputRef.current.value = searchTerm;
    }
  }, [searchTerm]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleSearch() {
    setParams({ searchTerm: value });
  }

  const debouncedHandleSearch = debounce((val: string) => {
    setParams({ searchTerm: val });
  }, 500);

  return (
    <div className="flex w-[50%] items-center border-2 border-gray-300 rounded-full py-2 shadow-sm">
      <span>
        <FaSearch size={34} className="bg-red-400 text-white rounded-full p-2 mx-2" />
      </span>
      <input
        // onKeyDown={(e) => {
        //   if (e.key === 'Enter') {
        //     handleSearch();
        //   }
        // }}
        ref={inputRef}
        onChange={(e) => {
          // handleChange(e);
          debouncedHandleSearch(e.target.value);
        }}
        type="text"
        placeholder="Search for cars by make, model or color"
        className="
          grow
          pr-4
          bg-transparent
          focus:outline-none
          border-transparent
          focus:border-transparent
          focus:ring-0
          text-sm
          text-gray-600
        "
      />
      {/* <button
        onClick={handleSearch}
      >
        <FaSearch size={34} className="bg-red-400 text-white rounded-full p-2 mx-2" />
      </button> */}
    </div>
  )
}