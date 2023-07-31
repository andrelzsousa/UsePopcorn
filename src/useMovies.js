import { useEffect, useState } from 'react';

const KEY = '74a9047d'

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        async function fecthMovies() {
            try {
                setError('')
                setIsLoading(true)
                const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal })

                if (!res.ok) throw new Error("Something went wrong with your connection.")

                const data = await res.json()
                if (data.Response === 'False') throw new Error("Movie not found");

                setMovies(data.Search)

            } catch (err) {
                if (err.name !== "AbortError") setError(err.message)

            } finally {
                setIsLoading(false)
            }
        }

        if (query.length < 3) {
            setMovies([])
            setError('')
            return
        }

        fecthMovies()

        return () => { controller.abort() }
    }, [query])

    return {movies, isLoading, error}
}