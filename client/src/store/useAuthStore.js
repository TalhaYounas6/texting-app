import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js"
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set,get)=>(
    {
      isSigningUp: false,
      isLoggingIn : false,
      isUpdatingProfile: false,
      authUser : null,
      isCheckingAuth : true,
      isUpdatingProfile : false,
      onlineUsers : [],
      socket : null,

      checkAuth : async()=>{
        try {
          const res = await axiosInstance.get("/auth/check",{
            withCredentials:true,
          });
          set({authUser : res.data});
        } catch (error) {
          console.log("Error checking auth: ",error);
          set({authUser : null})
        } finally{
          set({isCheckingAuth : false})
        }
      },

      signup : async(data)=>{
        set({isSigningUp : true});
        try {
          const res = await axiosInstance.post("/auth/signup",data)
          set({authUser : res.data});
          toast.success("Account Created Successfully");
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message)
        } finally{
          set({isSigningUp : false});
        }
      },

      login : async(data)=>{
        set({isLoggingIn : true});
        try {
          const res = await axiosInstance.post("/auth/login",data);
          set({authUser : res.data})
          toast.success("Login Successful")

          get().connectSocket(); 
        } catch (error) {
          toast.error(error.response.data.message);
        } finally{
          set({isLoggingIn : false})
        }
      },

      logout : async()=>{
        try {
          await axiosInstance.post("/auth/logout");
          toast.success("Logged out successfully");
          get().disconnectSocket(); 
          set({authUser : null});
          
        } catch (error) {
          toast.error(error.response.data.message);
          console.log("Error in logout: ",error);
        }
      },
      updateProfile : async(data)=>{
        set({isUpdatingProfile : true});
        try {
          const res = await axiosInstance.put("/auth/updateProfile",data);
          set({authUser : res.data})
          toast.success("Profile image updated successfully");
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({isUpdatingProfile : false});
        }

      },

      connectSocket : ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;
        const socket = io(import.meta.env.VITE_BASE_URL,{
          query:{
            userId : authUser.data.id,
          },
          withCredentials:true,
        });
        socket.connect();

        set({socket : socket});

        socket.on("getOnlineUsers",(userIds)=>{
          set({onlineUsers : userIds})
        })
      },

      disconnectSocket : ()=>{
        if(get().socket?.connected) get().socket.disconnect();
      },
    }
))