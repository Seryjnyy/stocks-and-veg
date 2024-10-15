import { useAuth } from "@/hooks/use-auth";
import { Tables } from "@/lib/supabase/database.types";
import { TOMATO_EMOJI } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "./ui/button";
import React from "react";
import { EyeIcon } from "lucide-react";
import { VariantProps } from "class-variance-authority";

export default function TomatoGroupUserButton({
    target,
    size,
}: {
    target: Tables<"tomato_target">;
    size?: VariantProps<typeof buttonVariants>["size"];
}) {
    const { session } = useAuth();
    const isUs = session && session.user.id == target.user_id;

    return (
        <Link
            to="/groups/$groupID/tomato/$userID"
            params={{
                groupID: target.group_id,
                userID: target.user_id,
            }}
        >
            <Button variant={"secondary"} size={size}>
                {!isUs && <>{TOMATO_EMOJI} Chuck tomatoes </>}
                {isUs && (
                    <>
                        <span className="relative">
                            <EyeIcon className="size-4 mr-2" />
                            <span className="absolute top-0 -left-2">
                                {TOMATO_EMOJI}
                            </span>
                        </span>
                        View yourself
                    </>
                )}
            </Button>
        </Link>
    );
}
