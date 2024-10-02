import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <div className="flex justify-center h-screen items-center flex-col">
            <h3>Welcome to stocks and veg!</h3>
            <div>
                <Link to="/groups">groups</Link>
            </div>
        </div>
    );
}
