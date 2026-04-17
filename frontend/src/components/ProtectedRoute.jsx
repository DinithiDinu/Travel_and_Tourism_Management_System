import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole')?.toUpperCase();

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute;