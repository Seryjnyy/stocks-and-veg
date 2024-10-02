import { useAuth } from "@/lib/hooks/use-auth";
import supabase from "@/lib/supabase/supabaseClient";
import { Auth as AuthForm } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth")({
    component: Auth,
    validateSearch: (search: { redirect?: string } & unknown) => {
        const redirect = search.redirect;
        if (typeof redirect != "string") {
            return {};
        }

        return { redirect: redirect };
    },
});

function Auth() {
    const { session } = useAuth();
    const { redirect } = Route.useSearch();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            if (redirect) {
                router.history.push(redirect);
            }
        }
    }, [session, redirect]);

    return (
        <div className="flex h-screen justify-center items-center">
            <AuthForm
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
            />
        </div>
    );
}
