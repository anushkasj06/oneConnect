import Layout from "./components/Layout";
import {Route, Routes, Navigate} from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationPage from "./pages/NotificationPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";



function App() {

  const {data: authUser, isLoading} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      } catch (error) {
        if(error.response.status === 401 || error.response){
          return null;
        }
        toast.error(error.response.data.message || "Something went wrong");
      }
    }
    
  });

  if(isLoading) return null;
  
  return <Layout>
    <Routes>
      <Route path='/' element={authUser ? <HomePage/>: <Navigate to='/login'/>}/>
      <Route path='/signup' element={!authUser ? <SignUpPage/>: <Navigate to='/'/>}/>
      <Route path='/login' element={!authUser ? <LoginPage/>: <Navigate to='/'/>}/>
      <Route path='/notifications' element={authUser ? <NotificationPage/>: <Navigate to='/login'/>}/>
      <Route path='/network' element={authUser ? <NetworkPage/>: <Navigate to='/login'/>}/>
      <Route path='/post/:postId' element={authUser ? <PostPage/>: <Navigate to='/login'/>}/>
      <Route path='/profile/:username' element={authUser ? <ProfilePage/>: <Navigate to='/login'/>}/>
    </Routes>
    <Toaster/>
  </Layout>;
}

export default App;
