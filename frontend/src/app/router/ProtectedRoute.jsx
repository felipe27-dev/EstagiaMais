import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    
    const tempoAtualEmSegundos = Date.now() / 1000;

    if (decodedToken.exp < tempoAtualEmSegundos) {
      console.warn("Token vencido, redirecionando para o login...");
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};