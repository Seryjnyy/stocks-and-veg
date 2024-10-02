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

interface AuthProps {
    children?: ReactNode;
}

export type AuthState = {
    session: Session | null;
};

export interface AuthContext extends AuthState {
    signOut: () => void;
}

const Context = createContext<AuthContext>(null as unknown as AuthContext);

const AuthProvider = ({ children }: AuthProps) => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const singOut = () => {
        supabase.auth.signOut();
    };

    const values = useMemo(
        () => ({
            session: session,
            signOut: singOut,
        }),
        [session]
    );

    return <Context.Provider value={values}>{children}</Context.Provider>;
};

const useAuth = () => {
    return useContext(Context);
};

export { useAuth };
export default AuthProvider;
