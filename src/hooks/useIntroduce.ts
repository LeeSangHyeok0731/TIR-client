import { useQuery } from "@tanstack/react-query";
import { fetchIntroduce, MoviePreference } from "@/api/introduce";

export const useIntroduce = () => {
  return useQuery<MoviePreference[]>({
    queryKey: ["introduce"],
    queryFn: fetchIntroduce,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
