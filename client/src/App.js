import "./index.css";
import "./App.css";
import React, { useEffect, lazy, Suspense, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import { setLoggedIn, logout } from "./store/authSlice";
import Loader from "./components/Loader";
const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const TodoList = lazy(() => import("./components/TodoList"));

export const API_URL = process.env.REACT_APP_API_URL;

function App() {
	const [isLoading, setIsLoading] = useState(false); // Initialize as false
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const dispatch = useDispatch();

	// Function to set isLoading to true when navigating
	const handleNavigation = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 200);
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			dispatch(setLoggedIn(true));
		} else {
			dispatch(setLoggedIn(false));
		}

		// Simulate a 1.5-second loading delay
		setTimeout(() => {
			setIsLoading(false); // Hide the loader after 1.5 seconds
		}, 1500);
	}, [dispatch]);

	const handleLogout = () => {
		dispatch(logout());
		localStorage.clear();
		setIsLoading(false); // Set isLoading to false when logging out
	};

	return (
		<div className="App">
			<nav>
				<span className="todo pad">TodoList</span>
				<div>
					{isLoggedIn ? (
						<>
							<Link className="pad" to="/todo" onClick={handleNavigation}>
								Todo
							</Link>
							<Link
								className="pad"
								to="/"
								onClick={() => {
									handleLogout();
									handleNavigation();
								}}
							>
								Logout
							</Link>
						</>
					) : (
						<>
							<Link className="pad" to="/register" onClick={handleNavigation}>
								Register
							</Link>
							<Link className="pad" to="/login" onClick={handleNavigation}>
								Login
							</Link>
						</>
					)}
				</div>
			</nav>

			{isLoading ? (
				<Loader /> // Show the loader when isLoading is true
			) : (
				<Suspense fallback={<Loader />}>
					<Routes>
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						{isLoggedIn ? (
							<Route path="/todo" element={<TodoList />} />
						) : (
							<Route
								path="/"
								element={
									<Navigate to="/login" /> // Redirect to login if not logged in
								}
							/>
						)}
					</Routes>
				</Suspense>
			)}
		</div>
	);
}

export default App;
