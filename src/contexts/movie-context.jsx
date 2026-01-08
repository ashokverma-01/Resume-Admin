import { createContext, useState } from "react";

export const MovieContext = createContext();

const MovieProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);

    const addMovie = (movie) => {
        setMovies((prev) => [...prev, movie]);
    };

    const removeMovie = (id) => {
        setMovies(movies.filter((m) => m._id !== id));
    };

    return <MovieContext.Provider value={{ movies, addMovie, removeMovie }}>{children}</MovieContext.Provider>;
};

export default MovieProvider;
