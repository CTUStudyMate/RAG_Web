import useSWR from "swr";
import { fetcher } from "../lib/utils";
import { UIUser } from "@/types/user-related";

export function useCurrentUser() {  //useSWR(key, fetcher) => fetcher(key)
    return useSWR<UIUser>(
        `/api/auth/me`,
        fetcher
    );
}