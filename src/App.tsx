import supabase from "@/lib/supabase/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider, { useAuth } from "./lib/hooks/use-auth";
import Stuff from "./stuff";
import GroupCreate from "./group/group-create";

const CheckAuth = () => {
    const { session, signOut } = useAuth();

    if (!session) {
        return (
            <div className="p-12">
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={[]}
                />
            </div>
        );
    } else {
        return (
            <div>
                <GroupCreate />
                {/* <Stuff /> */}
                Logged in!
                <div>
                    <button
                        onClick={() => {
                            signOut();
                            // setSession(null);
                        }}
                    >
                        log out
                    </button>
                </div>
            </div>
        );
    }
};

function Page() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <CheckAuth />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AuthProvider>
    );
}
export default Page;
