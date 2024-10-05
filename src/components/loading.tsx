import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-full flex justify-center items-center py-12 border">
            <Loader2 className="animate-spin" />
        </div>
    );
}
