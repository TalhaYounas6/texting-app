import {create} from "zustand"
import {axiosInstance} from "../lib/axios"
import {toast} from "react-hot-toast"
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,
    onlineUsers : [],

    getUsers : async(data)=>{
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get("/users");
            set({users : res.data.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isUsersLoading : false});
        }
    },

    getMessages : async(userId)=>{
        set({isMessagesLoading : true});
        try {
            const res = await axiosInstance.get(`/${userId}`);
            set({messages : res.data.data})
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isMessagesLoading : false});
        }
    },

    sendMessage : async(messageData) =>{
       const {selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post(`/send/${selectedUser.id}`,messageData,{
                withCredentials:true,
                headers:{"Content-Type":"multipart/form-data"}
            });
            // console.log(res);
            set({messages : [...messages,res.data.data]});
        } catch (error) {
            toast.error(error.toString());

            if(error.response){
                console.error("Error in response: ",error.response.data.message)
                console.error("Error status: ",error.response.status);
            }
            else if(error.request){
                console.error("Error in request: ",error.request)
            }
        }
    },

    subscribeToMessages : ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket  = useAuthStore.getState().socket;
        
        socket.on("newMessage",(message)=>{
            const {selectedUser,messages} = get();
            const isMessageFromSelectedUser = message.senderId === selectedUser.id;
            if(!isMessageFromSelectedUser) return;
            set({messages : [...get().messages,message]});
        });
    },

    unsubscribeFromMessages : ()=>{

        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    
    setSelectedUser : (selectedUser)=>set({selectedUser}),
}))