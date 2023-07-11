import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ENDPOINT } from '../common/endpoint'
import Banner from '../components/banner';
import ContentRow from '../components/content-rows'
import { useAuth } from '../firebase/auth';


export default function Browse() {
   
  return (
    <section className="absolute top-0">
      <Banner />
      <ContentRow
        endpoint={ENDPOINT.MOVIE_POPULAR}
        title="New & Popular"
      />
      <ContentRow endpoint={ENDPOINT.MOVIE_TOP_RATED} title="Top Rated" />
      <ContentRow endpoint={ENDPOINT.MOVIE_NOW_PLAYING} title="Now Playing" />
 
    </section>
  );
}
