import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../api/profiles";

export function useProfile(username: string) {
  return useQuery({
    queryKey: ["profile", username.toLowerCase()],
    queryFn: () => fetchProfile(username),
    enabled: username.length > 0,
  });
}
