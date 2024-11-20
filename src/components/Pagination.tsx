import React from 'react';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        <button className="px-2 rounded-sm bg-[#018abd] text-white">{currentPage}/{totalPages}</button>
      </div>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`py-2 px-4 rounded-md text-xs font-semibold ${currentPage === totalPages ? 'bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-[#018abd] text-white'}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;