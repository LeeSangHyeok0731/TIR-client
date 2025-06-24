import { useQuery } from "@tanstack/react-query";
import { fetchIntroduce } from "@/api/introduce";

export const useIntroduce = () => {
  return useQuery({
    queryKey: ["introduce"],
    queryFn: fetchIntroduce,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
