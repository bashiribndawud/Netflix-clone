// import { MovieVideoInfo, MovieVideoResult } from "../components/movie-card";
import { ENDPOINT } from "./endpoint";


export type MovieVideoResult<T> = {
  id: number;
  results: T;
  [k: string]: unknown;
};

export type MovieVideoInfo = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: string;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
  [k: string]: unknown;
};

export type MovieResult = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    realase_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    [k: string]: unknown
}

export interface MovieResponse <T> {
  page: number;
  results: T;
  total_pages: number;
  total_results: number;
  [k:string] : unknown;
}
// "movie/popular?language=en-US&page=1&region=NG";
export async function fetchRequest<T>(endpoint: string){
    const url = new URL(endpoint, import.meta.env.VITE_BASE_API);
    url.searchParams.append("api_key", import.meta.env.VITE_API_KEY);
    const response = await fetch(url);
    return response.json() as Promise<T>
}

export async function fetchVideoInfo(id: string) {
  const response = await fetchRequest<MovieVideoResult<MovieVideoInfo[]>>(
    ENDPOINT.MOVIE_VIDEO.replace("{movie_id}", id)
  );
  return response.results.filter(
    (result) => result.site.toLowerCase() === "youtube"
  );
}