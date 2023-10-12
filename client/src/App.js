import "./index.css";
import "./App.css";
import React, { useEffect, lazy, Suspense, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import { setLoggedIn, logout } from "./store/authSlice";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const TodoList = lazy(() => import("./components/TodoList"));
// import Register from './components/Register';
// import Login from './components/Login';
// import TodoList from './components/TodoList';

export const API_URL = process.env.REACT_APP_API_URL;
function App() {
	const [isLoading, setIsLoading] = useState(true);
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem("token");
		// console.log('Token: ', token);
		if (token) {
			dispatch(setLoggedIn(true));
		} else {
			dispatch(setLoggedIn(false));
		}
		console.log(isLoggedIn);

		setTimeout(() => {
			setIsLoading(false); // Hide the loader after 1.5 seconds
		}, 1500);
	}, [dispatch]);

	const handleLogout = () => {
		dispatch(logout());
		localStorage.clear();
	};

	return (
		<div className="App">
			<nav>
				<span className="todo pad">TodoList</span>
				<div>
					{isLoggedIn ? (
						<>
							<Link className="pad" to="/todo">
								Todo
							</Link>
							<Link
								className="pad"
								to="/"
								onClick={() => {
									handleLogout();
								}}
							>
								Logout
							</Link>
						</>
					) : (
						<>
							<Link className="pad" to="/register">
								Register
							</Link>
							<Link className="pad" to="/login">
								Login
							</Link>
						</>
					)}
				</div>
			</nav>

			{isLoading ? (
				<Loader /> // Show the loader while isLoading is true
			) : (
				<Suspense fallback={<Loader />}>
					<Routes>
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						<Route path="/todo" element={<ProtectedRoute element={<TodoList />} />} />
						<Route path="/" element={<ProtectedRoute element={<Login />} />} />
						{/* {isLoggedIn ? (
							<Route
								path="/todo"
								element={
									<ProtectedRoute>
										<TodoList />
									</ProtectedRoute>
								}
							/>
						) : (
							<Route
								path="/"
								element={
									<ProtectedRoute
										element={
											<Navigate to="/login" /> // Redirect to login if not logged in
										}
									/>
								}
							/>
						)} */}
					</Routes>
				</Suspense>
			)}
		</div>
	);
}
export default App;
