import React, { useEffect, useState, useRef } from "react";
import { fetchRequest, MovieResponse, MovieResult } from "../common/api";
import { ENDPOINT } from "../common/endpoint";
import ChevronLeft from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronRight from "@heroicons/react/24/outline/ChevronRightIcon";
import PageIndicator from "./page-indicator";
import MovieCard from "./movie-card";

type RowProps = {
  endpoint: string;
  title: string;
  
};

const CARD_WIDTH = 200;

export default function ContentRow({ title, endpoint }: RowProps) {
  const [rowData, setRowData] = useState<MovieResult[]>([]);
  const [pagesCount, setPagesCount] = useState(0);
  const sliderRef = useRef<HTMLSelectElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const cardPerPage = useRef(0);
  const [currentPage, setCurrentPage] = useState(0)
  const disabledPrev = currentPage === 0;
  const disabledNext = currentPage + 1 === pagesCount;
  const containerRef = useRef<HTMLSelectElement>(null);

  async function fetchRowData() {
    const response = await fetchRequest<MovieResponse<MovieResult[]>>(endpoint);
    // console.log(popularMovie);
    setRowData(response.results.filter(result => result.poster_path));
  }
  

  function onNextClick() {
    if (sliderRef.current) {
      let updatedTranslateX = translateX - getTranslateXValue();
      sliderRef.current.style.transform = `translateX(${updatedTranslateX}%)`;
      setTranslateX(updatedTranslateX);
      setCurrentPage(currentPage + 1)
    }
  }
  function onPrevClick() {
    if (sliderRef.current) {
      let updatedTranslateX = translateX + getTranslateXValue();
      sliderRef.current.style.transform = `translateX(${updatedTranslateX}%)`;
      setTranslateX(updatedTranslateX);
      setCurrentPage(currentPage - 1)
    }
  }

  function getTranslateXValue() {
    let translateX = 0;
    if (sliderRef.current) {
      translateX =
        ((cardPerPage.current * CARD_WIDTH) / sliderRef.current.clientWidth) *
        100;
    }
    return translateX;
  }

  useEffect(() => {
    if (rowData?.length) {
      if (containerRef.current) {
        cardPerPage.current = Math.floor(
          containerRef.current.clientWidth / CARD_WIDTH
        );
        setPagesCount(Math.ceil(rowData.length / cardPerPage.current));
      }
    }
  }, [rowData.length]);

  useEffect(() => {
    fetchRowData();
  }, []);

  return (
    <section className="row-container ml-10 overflow-hidden hover:cursor-pointer">
      <h2 className="text-xl">{title}</h2>
      <PageIndicator
        pagesCount={pagesCount}
        currentPage={currentPage}
        className="mb-2 opacity-0 transition-opacity duration-500 ease-in"
      />
      <section ref={containerRef} className="relative flex flex-nowrap gap-2 mb-8">
        {!disabledPrev ? (
          <button
            className="absolute z-[1] h-full w-12 bg-black/25 opacity-0 transition-opacity duration-500 ease-in"
            onClick={onPrevClick}
          >
            <ChevronLeft />
          </button>
        ) : null}
        {!disabledNext ? (
          <button
            className="absolute right-0 z-[1] h-full w-12 bg-black/25 opacity-0 transition-opacity duration-500 ease-in"
            onClick={onNextClick}
          >
            <ChevronRight />
          </button>
        ) : null}
        <section
          ref={sliderRef}
          className="flex gap-3 transition-transform duration-700 ease-linear"
        >
          {rowData?.map((row,index) => {
            const { id, title, poster_path } = row;
            
            return (
              <MovieCard
                uid={`${row.id}-${title}`}
                key={`${row.id}-${title}`}
                poster_path={poster_path}
                id={id}
                title={title}
              />
            );
          })}
          
        </section>
      </section>
    </section>
  );
}
