import { useAuth } from "@/hooks/use-auth";
import { Tables } from "@/lib/supabase/database.types";
import { TOMATO_EMOJI } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import useWorkStatus from "@/hooks/use-work-status";
import SpinnerButton from "@/spinner-button";

const TomatoButton = ({
    isUs,
    size,
}: {
    isUs: boolean;
    size: VariantProps<typeof buttonVariants>["size"];
}) => {
    return (
        <SpinnerButton variant={"secondary"} size={size} isPending={false}>
            {!isUs && <>{TOMATO_EMOJI} Chuck tomatoes </>}
            {isUs && (
                <>
                    <span className="relative ml-2">
                        <EyeIcon className="size-4 mr-2" />
                        <span className="absolute top-0 -left-2">
                            {TOMATO_EMOJI}
                        </span>
                    </span>
                    View yourself
                </>
            )}
        </SpinnerButton>
    );
};

export default function TomatoGroupUserButton({
    target,
    size,
}: {
    target: Tables<"tomato_target">;
    size?: VariantProps<typeof buttonVariants>["size"];
}) {
    const isWorkEnabled = useWorkStatus();
    const { session } = useAuth();
    const isUs = session?.user.id == target.user_id;

    if (!session) return null;

    if (!isWorkEnabled) return <TomatoButton isUs={isUs} size={size} />;

    return (
        <Link
            to="/groups/$groupID/tomato/$userID"
            params={{
                groupID: target.group_id,
                userID: target.user_id,
            }}
        >
            <TomatoButton isUs={isUs} size={size} />
        </Link>
    );
}
