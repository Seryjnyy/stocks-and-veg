import supabase from "@/lib/supabase/supabaseClient";
import {
    useInsertMutation,
    useQuery,
} from "@supabase-cache-helpers/postgrest-react-query";
import { useAuth } from "./lib/hooks/use-auth";
import { useEffect } from "react";
import { useGetUserGroups } from "./lib/hooks/queries/use-get-user-groups";
import { useCreateGroup } from "./lib/hooks/mutations/use-create-group";

function Stuff() {
    const { session } = useAuth();

    const { data, error, refetch } = useGetUserGroups({ session: session });

    const { mutateAsync: insert, isPending } = useCreateGroup();

    if (error) {
        return null;
    }

    return (
        <>
            <div>count:{data?.length}</div>
            <ul className="border p-2">
                {data?.map((country) => (
                    <li key={country.id}>{country.group_id}</li>
                ))}
            </ul>
            <button
                onClick={async () => {
                    insert([{ name: "Poland" }], {
                        onSuccess: () => console.log("Success"),
                        onError: (e) => console.error("Oh no", e.message),
                    });
                }}
            >
                {isPending ? "...loading" : "Add group"}
            </button>
            <button onClick={() => refetch()}>refetch</button>
        </>
    );
}
export default Stuff;
