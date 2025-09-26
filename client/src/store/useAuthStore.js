import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js"
import toast from "react-hot-toast";

export const useAuthStore = create((set)=>(
    {
      isSigningUp: false,
      isLoggingIn : false,
      isUpdatingProfile: false,
      authUser : null,
      isCheckingAuth : true,
      isUpdatingProfile : false,

      checkAuth : async()=>{
        try {
          const res = await axiosInstance.get("/auth/check");
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
        } catch (error) {
          toast.error(error.response.data.message);
        } finally{
          set({isLoggingIn : false})
        }
      },

      logout : async()=>{
        try {
          await axiosInstance.post("/auth/logout");
          toast.success("Logged out successfully")
        } catch (error) {
          toast.error(error.response.data.message);
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
    }
))