import { Session } from "@supabase/supabase-js";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import supabase from "@/lib/supabase/supabaseClient";
import { useNavigate } from "@tanstack/react-router";
import { TabletSmartphone } from "lucide-react";
import { Tables } from "../lib/supabase/database.types";
import { useGetUserProfile } from "./supabase/profile/use-get-profile";

interface AuthProps {
    children?: ReactNode;
}

export type AuthState = {
    session: Session | null;
    profile: Tables<"profile"> | null;
    isLoading: boolean;
};

export interface AuthContext extends AuthState {
    signOut: () => void;
}

const Context = createContext<AuthContext>(null as unknown as AuthContext);

// Use isLoading to stop redirect to auth page when the session is loading in
const AuthProvider = ({ children }: AuthProps) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { data: profile } = useGetUserProfile({ user_id: session?.user.id });

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {}, [session]);

    const singOut = () => {
        supabase.auth.signOut();
    };

    const values = useMemo(
        () => ({
            session: session,
            profile: profile == null ? null : profile,
            signOut: singOut,
            isLoading: isLoading,
        }),
        [session, profile, isLoading]
    );

    return <Context.Provider value={values}>{children}</Context.Provider>;
};

const useAuth = () => {
    return useContext(Context);
};

export { useAuth };
export default AuthProvider;
