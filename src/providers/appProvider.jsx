import AuthProvider from "../contexts/auth-context";
import MovieProvider from "../contexts/movie-context";

const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <MovieProvider>{children}</MovieProvider>
        </AuthProvider>
    );
};

export default AppProvider;
