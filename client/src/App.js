import './index.css';
import './App.css';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { setLoggedIn, logout } from './store/authSlice';
import Register from './components/Register';
import Login from './components/Login';
import TodoList from './components/TodoList';

export const API_URL = process.env.REACT_APP_API_URL;
function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // console.log('Token: ', token);
    if (token) {
      dispatch(setLoggedIn(true));
    } else {
      dispatch(setLoggedIn(false));
    }
    console.log(isLoggedIn);
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
              <Link className="pad" to="/" onClick={handleLogout}>
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

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {isLoggedIn ? (
          <Route path="/todo" element={<TodoList />} />
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
