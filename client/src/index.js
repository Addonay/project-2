import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
// import React, { useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { Button, Container, Avatar, Typography } from '@mui/material';
// import { motion } from 'framer-motion';
// import Cookies from 'js-cookie';

// function Login() {
//   const [user, setUser] = useState({});
  
//   const handleCallbackResponse = (response) => {
//     // Extract the JWT token from the response
//     const jwtToken = response.credential;

//     // Store the token in localStorage
//     localStorage.setItem('userToken', jwtToken);

//     // Set the user based on the token
//     const userObject = jwtDecode(jwtToken);
//     setUser(userObject);

//     document.getElementById('signInDiv').hidden = true;
//   };

//   const handleSignOut = () => {
//     // Clear the token from localStorage
//     localStorage.removeItem('userToken');
    
//     // Clear the user
//     setUser({});
    
//     // Show the sign-in button
//     document.getElementById('signInDiv').hidden = false;
//   };

//   useEffect(() => {
//     // Check for and retrieve the JWT token from localStorage
//     const storedToken = localStorage.getItem('userToken');

//     if (storedToken) {
//       // Set the user based on the stored token
//       const userObject = jwtDecode(storedToken);
//       setUser(userObject);

//       // Hide the sign-in button
//       document.getElementById('signInDiv').hidden = true;
//     } else {
//       // If the token doesn't exist, set up Google Sign-In
//       google.accounts.id.initialize({
//         client_id: '798667058109-kkgti290ee89mq9q1331rqmop7u1v4fd.apps.googleusercontent.com',
//         callback: handleCallbackResponse,
//       });
//       google.accounts.id.renderButton(document.getElementById('signInDiv'), { theme: 'outline', size: 'large' });
//       google.accounts.id.prompt();
//     }
//   }, []);

//   return (
//     <Container maxWidth="sm" className="Login">
//       <motion.div id="signInDiv" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         {/* Google Sign-In Button */}
//       </motion.div>
//       {Object.keys(user).length !== 0 && (
//         <Button variant="outlined" onClick={handleSignOut}>
//           Sign out
//         </Button>
//       )}
//       {user && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <Avatar alt="User Avatar" src={user.picture} />
//           <Typography variant="h6">{user.name}</Typography>
//         </motion.div>
//       )}
//     </Container>
//   );
// }

// export default Login;