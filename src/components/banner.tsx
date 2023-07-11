import React, { useEffect, useState } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import {
  fetchRequest,
  fetchVideoInfo,
  MovieResponse,
  MovieResult,
  MovieVideoInfo,
} from "../common/api";
import { ENDPOINT } from "../common/endpoint";
import { crateimageURl } from "../common/utils";
import PlayIcon from "@heroicons/react/24/solid/PlayIcon";
import Info from "@heroicons/react/24/outline/InformationCircleIcon";
import Loadder from "./loadder";

function Banner() {
  const [randomMovies, setRandomMovies] = useState<MovieResult>();
  const [videoInfo, setVideoInfo] = useState<MovieVideoInfo>();
  const [hidePoster, setHidePoster] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const options: YouTubeProps["opts"] = {
    width: document.body.clientWidth,
    height: "800",
    // playerVars: { autoplay: 1, playsinline: 1, controls: 1 },
  };
  function getRandomIndex(last: number) {
    return Math.floor(Math.random() * last - 1);
  }
  async function fetchPopularMovies() {
    const response = await fetchRequest<MovieResponse<MovieResult[]>>(
      ENDPOINT.MOVIE_POPULAR
    );
    const filteredMovie = response.results.filter(
      (movie) => movie.backdrop_path
    );
    const randomSelectedMovie =
      filteredMovie[getRandomIndex(filteredMovie.length)];
    setRandomMovies(randomSelectedMovie);

    const videoInfo = await fetchVideoInfo(randomSelectedMovie.id.toString());
    setVideoInfo(videoInfo[0]);
    setTimeout(() => {
      setHidePoster(true);
    }, 1000);
  }

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  //   gives us info about the video  (playing or not)
  function onStateChange(event: YouTubeEvent<number>) {
    // video has finished playing
    if (event.data === 0) {
      setHidePoster(false);
      setShowBackdrop(true)
    } else if (event.data === 1) { //video is playing
      setHidePoster(true);
      setShowBackdrop(false)
    }
  }

  return randomMovies ? (
    <section className="relative aspect-video h-[800px] w-full">
      <img
        src={crateimageURl(randomMovies?.backdrop_path as string, 200)}
        alt={randomMovies?.title}
        className={`${hidePoster ? "invisible h-0" : "visible"}`}
      />
      {videoInfo ? (
        <YouTube
          videoId={videoInfo?.key}
          opts={options}
          id="video-banner"
          className={`${
            hidePoster ? "visible h-full" : "invisible h-0"
          } absolute -mt-14`}
          onStateChange={onStateChange}
        />
      ) : null}
     {showBackdrop ? <section className="z-1 absolute top-0 left-0 h-full w-full bg-dark/70"></section> : null}
      <section className="z-1 absolute bottom-16 ml-16 flex max-w-sm flex-col gap-2">
        <h2 className="text-6xl">{randomMovies.title}</h2>
        <p className="text-sm line-clamp-3">{randomMovies.overview}</p>
        <section className="flex gap-2">
          <button className="flex w-[150px] items-center rounded-md bg-white p-2 text-dark justify-center">
            <PlayIcon className="mr-2 h-8 w-8" /> <span>Play</span>
          </button>
          <button className="flex w-[150px] items-center rounded-md bg-zinc-400/50 p-2 text-white justify-center">
            <Info className="mr-2 h-8 w-8" /> <span>More Info</span>
          </button>
        </section>
      </section>
    </section>
  ) : <Loadder />;
}

export default Banner;
