import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useToast } from "@/hooks/use-toast";
import { useCreateInviteLink } from "@/lib/hooks/mutations/use-create-invite-link";
import { useGetInviteLink } from "@/lib/hooks/queries/use-get-invite-link";
import { formatInviteLink } from "@/lib/utils";
import SpinnerButton from "@/spinner-button";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Copy, RefreshCw } from "lucide-react";

// TODO : error unhandled
export default function Invite({ groupID }: { groupID: string }) {
    const { data, isError, isLoading } = useGetInviteLink({ groupID: groupID });
    const { mutateAsync: createInviteLink, isPending } = useCreateInviteLink();
    const { toast } = useToast();
    const [copiedText, copy] = useCopyToClipboard();

    const handleCopy = (text: string) => {
        copy(text)
            .then(() => {
                toast({
                    title: "Successfully copied invite link.",
                });
            })
            .catch((error) => {
                toast({
                    title: "Failed to copy invite link.",
                    variant: "destructive",
                });
            });
    };

    const handleGenerateLink = () => {
        createInviteLink(
            [
                {
                    id: data?.id ?? undefined,
                    group_id: groupID,
                    token: "",
                    expires_at: new Date().toISOString(),
                    used: false,
                },
            ],
            {
                onSuccess: () => {
                    toast({
                        title: "Successfully generated invite link.",
                        description:
                            "Invite link was copied to your clipboard.",
                    });
                },
                onError: () => {
                    toast({
                        title: "Failed to generate invite link.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    const isInviteLinkExpired = data
        ? new Date() > new Date(data.expires_at)
        : false;

    const isInviteLinkUsed = data?.used ?? false;

    return (
        <>
            {data && (
                <Badge
                    className="absolute -top-8 right-0"
                    variant={
                        isInviteLinkExpired || isInviteLinkUsed
                            ? "destructive"
                            : "secondary"
                    }
                >
                    {isInviteLinkExpired
                        ? "Expired"
                        : isInviteLinkUsed
                          ? "Used"
                          : "Active"}
                </Badge>
            )}
            <Card className="w-full border-none">
                <CardContent className="px-0">
                    <div className="space-y-4">
                        {data ? (
                            <div className="flex items-center space-x-2">
                                <code
                                    className={cn(
                                        "flex-1 p-2 bg-muted rounded text-sm break-all",
                                        {
                                            "select-none text-muted-foreground/50":
                                                isInviteLinkExpired ||
                                                isInviteLinkUsed,
                                        }
                                    )}
                                >
                                    {formatInviteLink(data?.token)}
                                </code>
                                <Button
                                    size="icon"
                                    onClick={() => {
                                        if (data) {
                                            handleCopy(
                                                formatInviteLink(data?.token)
                                            );
                                        }
                                    }}
                                    disabled={
                                        data == null ||
                                        isInviteLinkExpired ||
                                        isInviteLinkUsed ||
                                        isLoading ||
                                        isPending
                                    }
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">
                                No active invite link
                            </p>
                        )}
                        <SpinnerButton
                            isPending={isPending}
                            disabled={isPending || isLoading}
                            disableWorkCheck
                            onClick={handleGenerateLink}
                            className="w-full"
                            variant={"outline"}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            {data ? "Generate New Link" : "Create Invite Link"}
                        </SpinnerButton>
                        <p className="text-sm text-muted-foreground">
                            Get a invite link and share it with your friend.
                            They can visit the link to join this group.
                            <br />
                            Invite links are valid for a day.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
