
import { UserProfile } from "@/types/patient";
import { createClient } from "@/utils/supabase/client";
import {  useQuery } from "@tanstack/react-query"

const supabase = await createClient();

const getUserDetails = async (): Promise<any> => {
  const { data, error } = await supabase.auth.getSession();
  
  console.log("🚀 ~ getUserDetails ~ data:", data)
  const userDetails = {
    name: data.session?.user.user_metadata.first_name,
    email: data.session?.user.user_metadata.email,
    avatar: data.session?.user.user_metadata.avatar_url // Assuming this is in your public directory
  }
  console.log("🚀 ~ getUserDetails ~ userDetails:", userDetails)
 
  
  if (error) {
    throw Error("Unexpected error")
  }
  if (data) {
    return userDetails
  }
};

export const useGetUserDetails= () => {
    return useQuery({
        queryKey: ["user_data","my"],
        queryFn: () => getUserDetails(),
        staleTime: 1000 * 60 * 5, //  5 minute
        gcTime: 1000 * 60 * 30, // 30 minutes cache
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
  };


const getUserProfile = async (): Promise<UserProfile> => {
  const { data:user,} = await supabase.auth.getUser();
  const {data,error} =  await supabase.from('profiles').select().eq('id', user?.user?.id).single()
  
  if (error) {
    throw Error("Unexpected error")
  }
  return data
};

export const useGetUserProfile= () => {
    return useQuery({
        queryKey: ["user_data","profile"],
        queryFn: () => getUserProfile(),
        staleTime: 1000 * 60 * 5, //  5 minute
        gcTime: 1000 * 60 * 30, // 30 minutes cache
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
  };


  const getUserCases = async (): Promise<any> => {
    const { data:user,} = await supabase.auth.getUser();
    const {data,error} =  await supabase.from('service_data').select("*").eq('user_id', user?.user?.id)
    
    if (error) {
      throw Error("Unexpected error")
    }
    return data
  };
  
  export const useGetUserCases= () => {
      return useQuery({
          queryKey: ["user_data","cases"],
          queryFn: () => getUserCases(),
          staleTime: 1000 * 60 * 5, //  5 minute
          gcTime: 1000 * 60 * 30, // 30 minutes cache
          refetchOnWindowFocus: false,
          refetchOnMount: false,
      });
    };



//update icd prediction
const updateIcdPrediction = async (): Promise<any> => {
  

  if (error) {
    throw Error("Error Updating Patient")
  }
      
    return patient_id
};

export const UseUpdateIcdPrediction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateIcdPrediction,
    onSuccess: (id) => {
    queryClient.invalidateQueries({ queryKey: ["prediction_data",id] }); 
    toast({
      title: "Prediction Updated",
      }); 
    return true;
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Patient",
        });
      return error;
    }
  });
};


