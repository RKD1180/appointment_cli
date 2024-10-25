import { Navigate } from "react-router-dom";

interface Props{
    children: JSX.Element | React.ReactNode; 
  
}

const ProtectedRoute = ({ children }:Props) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    // Redirect to login if token is not found
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected component if the token exists
};

export default ProtectedRoute;