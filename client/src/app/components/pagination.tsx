'use client';

import config from '../config';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const maxPagesToShow = config.maxPagesToShow;
  const halfMaxPages = Math.floor(maxPagesToShow / 2);

  const renderPageButtons = () => {
    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
      <button
        key={startPage + index}
        className={`mx-2 px-4 py-2 border ${startPage + index === currentPage ? 'border-primary text-primary' : 'border-neutral-500'}`}
        onClick={() => onPageChange(startPage + index)}
      >
        {startPage + index}
      </button>
    ));
  };

  return (
    <div className="flex justify-center mt-4 pb-6">
      {currentPage > halfMaxPages && <span className="mx-2 text-neutral-500">...</span>}
      {renderPageButtons()}
      {totalPages > currentPage + halfMaxPages && <span className="mx-2 text-neutral-500">...</span>}
    </div>
  );
};

export default Pagination;
