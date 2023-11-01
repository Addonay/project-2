import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;


// const onGoogleLogin = () => {
//   gapi.auth2.getAuthInstance().signIn().then(() => {
//     toast.success('Logged in automatically!', { position: 'top-right' });
//   });
// };

// useEffect(() => {
//   // Load the auth2 library (only need to do this once per page load)
//   gapi.load('auth2', function() {
//     gapi.auth2.init({
//       client_id: '165145176290-u21ta8faf46erbp6b2r68p6513gq6vqh.apps.googleusercontent.com',
//     });
//   });

//   // Check if the user is already signed in and automatically log them in
//   const auth2 = gapi.auth2.getAuthInstance();
//   if (auth2.isSignedIn.get()) {
//     onGoogleLogin();
//   }
// }, []);