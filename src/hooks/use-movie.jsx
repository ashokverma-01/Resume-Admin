import { useContext } from "react";
import { MovieContext } from "../contexts/movie-context";

const useMovie = () => useContext(MovieContext);
export default useMovie;
