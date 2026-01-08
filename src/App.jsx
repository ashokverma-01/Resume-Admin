import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";

// movies
import ResumePage from "@/routes/Resume/list/page";
import ViewResume from "./routes/Resume/details/page";

import Profile from "@/routes/Profile/profile";
import ProfileEdit from "./routes/Profile/ProfileEdit";
import CustomerList from "@/routes/customers/list/list";
import Login from "@/routes/Login/login";
import UnauthorizedPage from "@/routes/NotPage";

import AdminProtectedRoute from "@/routes/ProtectedRoute";

function App() {
    const router = createBrowserRouter([
        // 🔓 PUBLIC ROUTES
        { path: "/login", element: <Login /> },
        { path: "/unauthorized", element: <UnauthorizedPage /> },

        {
            element: <AdminProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <Layout />,
                    children: [
                        { index: true, element: <DashboardPage /> },
                        { path: "customers", element: <CustomerList /> },
                        { path: "resumes", element: <ResumePage /> },

                        { path: "view/:id", element: <ViewResume /> },
                        { path: "settings", element: <h1>Settings</h1> },
                        { path: "profile", element: <Profile /> },
                        { path: "profile/edit/:id", element: <ProfileEdit /> },
                    ],
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
