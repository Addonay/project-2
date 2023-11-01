
import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import {  Avatar, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Login = () => {
  const [user, setUser] = useState({});
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'));

  const handleLogin = (response) => {
    if (response.credential) {
      const token = response.credential;
      setJwtToken(token);
      localStorage.setItem('jwtToken', token);
      const userObject = jwtDecode(token);
      setUser(userObject);
      console.log(userObject)
    }
    
};

  

  const handleLogout = () => {
    setJwtToken(null);
    localStorage.removeItem('jwtToken');
    googleLogout(); // Log out from Google as well if using Google OAuth
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');

    if (storedToken) {
      setJwtToken(storedToken);
    } else {
      // If no token is found in local storage, show the Google One Tap prompt
      showGoogleOneTap();
    }
  }, []);

  const clientId = '798667058109-kkgti290ee89mq9q1331rqmop7u1v4fd.apps.googleusercontent.com'; // Replace with your actual Google API client ID

  const showGoogleOneTap = () => {
    const googleOneTapScript = document.createElement('script');
    googleOneTapScript.src = 'https://accounts.google.com/gsi/client';
    googleOneTapScript.async = true;

    googleOneTapScript.onload = () => {
      // Initialize Google One Tap
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            handleLogin(response.credential);
          }
        },
      });
    };

    document.head.appendChild(googleOneTapScript);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        {jwtToken ? (
          <div>
            {user && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Avatar alt="User Avatar" src={user.picture} />
          <Typography variant="h6">{user.name}</Typography>
        </motion.div>
      )}
            <p>You are logged in.</p>
            <button onClick={handleLogout}>Log Out</button> {/* Sign-out button */}
          </div>
        ) : (
          <div>
            {/* Google One Tap will be shown automatically when there's no token */}
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => console.log('Login Failed')}
              useOneTap
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
