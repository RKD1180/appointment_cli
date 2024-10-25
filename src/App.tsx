import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Registration/Registration";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Users from "./pages/Users/Users";
import Appointments from "./pages/Appointments/Appointments";

function App() {
  const router = createBrowserRouter([
    // Public Routes
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign-up",
      element: <Register />,
    },
    // Protected Dashboard Routes
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Users/>,
        },
        {
          path: "/dashboard/my-appointment",
          element: <Appointments/>,
        },
      ],
    },

    // Catch-all route for 404
    {
      path: "*",
      element: <div>404 - Page Not Found</div>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
