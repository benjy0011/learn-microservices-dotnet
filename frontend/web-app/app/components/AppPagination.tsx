'use client';

import { Pagination } from "flowbite-react";

type Props = {
  currentPage: number;
  pageCount: number;
  pageChanged: (page: number) => void;
}

export default function AppPagination( { currentPage, pageCount, pageChanged } : Props ) {

  return (
    <Pagination
      currentPage={currentPage}
      onPageChange={e => pageChanged(e)}
      totalPages={pageCount > 0 ? pageCount : 1}
      layout="pagination"
      showIcons={true}
      className="text-blue-500"
    />
  )
}