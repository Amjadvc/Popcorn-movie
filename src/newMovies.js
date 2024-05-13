import { useEffect, useState } from "react";

const KEY = "8d128651";
export function useMovies(query, callBack) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [isLoding, setIsLodaing] = useState(false);

  useEffect(
    function () {
      callBack?.();
      const controller = new AbortController();
      const signal = controller.signal;
      async function fetchMovies() {
        try {
          setIsLodaing(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal }
          );
          //Error for lost conection to the internet
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          //Error for movie Not Found
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLodaing(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, error, isLoding };
}
