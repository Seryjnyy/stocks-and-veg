import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loadingVariants = cva("flex justify-center items-center", {
    variants: {
        variant: {
            component: "",
            page: "w-full pt-28",
        },
    },
    defaultVariants: {
        variant: "component",
    },
});

interface LoadingProps extends VariantProps<typeof loadingVariants> {}

export default function Loading({ variant }: LoadingProps) {
    return (
        <div className={cn(loadingVariants({ variant }))}>
            <Loader2 className="animate-spin" />
        </div>
    );
}
