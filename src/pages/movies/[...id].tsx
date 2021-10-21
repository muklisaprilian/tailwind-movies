import { useGetMovieImagesQuery, useGetMovieQuery, useGetRecommendationsQuery } from "@/services/TMDB"
import { GetServerSideProps } from 'next'
import Layout from "@/layout"
import { useRouter } from "next/router"
import { SingleResults } from "@/types/types"
import { Carrousel, Loader, Main, Movie, MovieInfo, Recommended } from "@/components"
import { Typography } from "@/components/ui"
import { useEffect } from "react"




const MovieInformation = ({ id }) => {
  const router = useRouter()


  // console.log(router.query.id, 'routes')
  const movieId = id.length > 1 ? id[1] : id[0]

  const { data, isLoading, error } = useGetMovieQuery({ id: movieId }, { refetchOnMountOrArgChange: true })
  const { data: imagesData, isLoading: isImagesLoading } = useGetMovieImagesQuery({ id: movieId })
  const { data: recommendations, isLoading: isRecommendationsLoading } = useGetRecommendationsQuery({ list: '/recommendations', movie_id: data?.id });
  useEffect(() => {
    window.scroll({ top: 0, behavior: 'smooth' });
  }, [movieId])



  return (
    <Layout>
      <Main movie>
        {isLoading ? <Loader isInfo /> : (
          <>
            <Carrousel imagesData={imagesData} movieData={data} />
            <MovieInfo data={data} />
            <Recommended title="Recommended Movies">
              {recommendations && recommendations.results.length > 0 ? recommendations.results.slice(0, 12).map((movie: SingleResults, i) => {
                return (
                  <Movie data={movie} key={i} value={i} />
                )
              }) : <div>Sorry No recommendation were found</div>}
            </Recommended>
          </>
        )}
        {error && <Typography> Sorry there was an error fetching data.. </Typography>}

      </Main>


    </Layout>
  )
}


export default MovieInformation

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      id: ctx.params.id
    }
  }
}



