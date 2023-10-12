import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	console.log("isLoggedIn in ProtectedRoute:", isLoggedIn);

	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}
	return element;
};

export default ProtectedRoute;
