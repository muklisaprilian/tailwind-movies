import { useGetMoviesByActorIdQuery, useGetActorsDetailsQuery, useGetActorImagesQuery } from "@/services/TMDB"
import { GetServerSideProps } from 'next'
import MovieImagesCarrousel from "@/components/movie-images-carrousel/movie-images-carrousel"
import SingleMovie from "@/components/movie/movie"
import Main from "@/components/main/main"
import Typography from "@/components/ui/typography"
import Layout from "@/layout"
import { useRouter } from 'next/router'
import { useState } from "react"
import Button from "@/components/ui/button"




const People = ({ id }) => {
  // console.log(id);
  const { data, isLoading } = useGetActorsDetailsQuery(id)
  const { data: movieByActor } = useGetMoviesByActorIdQuery({ id: id, page: 1 })
  const { data: actorImages } = useGetActorImagesQuery({ id })
  const router = useRouter()
  const [more, setMore] = useState(false)
  if (isLoading) <p>Still loading page</p>

  return (
    <Layout>
      <Main movie>
        <MovieImagesCarrousel imagesData={actorImages} />
        {data && <div className="px-1 md:px-[10px] py-2  md:col-span-6 lg:col-span-3 h-full md:max-h-full">
          <div className="mt-5  border-red-900  flex flex-col items-center md:items-center">
            <Typography as="h3" className="md:tracking-wider text-center" >{data.name}</Typography>
            <Typography as="h4" className="tracking-wide my-2"> {data.birthday} </Typography>
            <Typography as="h4" className="tracking-wide my-2">Born: {data.place_of_birth} </Typography>
          </div>
          <div className="space-y-3">
            <Typography as="p" className={more ? "line-clamp-none" : "line-clamp-6"}>{data.biography}</Typography>
            <Button variant="secondary" resetStyles onClick={() => setMore(!more)} className="p-2 rounded-xl">{more ? "Less" : "More"} &rarr; </Button>
          </div>
          <div className="flex justify-between mt-4">
            <a className="bg-white text-blue-500 px-2 md:px-4  h-[fit-content]  py-2 rounded-lg border flex justify-center items-center space-x-3 text-lg cursor-pointer hover:bg-light-extra-two transition-all ease-in duration-200 hover:text-light dark:hover:bg-dark-background-primary" target="_blank" href={`https://www.imdb.com/name/${data.imdb_id}`} rel="noreferrer" >&rarr; IMDB</a>
            <Button variant="secondary" onClick={() => router.back()}>&larr; Back </Button>
          </div>
        </div>
        }


        {/* movies by Actors*/}
        <div className="flex flex-col pt-3 px-2 col-span-7">
          <Typography as="h2" className="my-2">Movies with {data?.name} </Typography>
          <div className="flex flex-col items-center gap-2 md:grid md:grid-cols-2 lg:grid-cols-4  max-h-screen  md:max-h-[1200px] overflow-auto no-scrollbar  py-2">
            {movieByActor ? movieByActor.results.slice(0, 12).map((movie, i) => {
              return (
                <SingleMovie data={movie} key={i} />
              )
            }) : <div>Sorry No recommendation were found</div>}
          </div>
        </div>



      </Main>
    </Layout>
  )
}

export default People


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // console.log(ctx);
  return {
    props: {
      id: ctx.params.id
    }
  }
}