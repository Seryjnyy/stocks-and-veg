import { UserAvatar } from "@/components/group/group-user-profile";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useWorkStatus from "@/hooks/use-work-status";
import { GroupUserWithProfile } from "@/hooks/supabase/group/use-get-group-users";
import { Tables } from "@/lib/supabase/database.types";
import SpinnerButton from "@/components/spinner-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { ArrowUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateChatMsg } from "./use-create-chat-msg";
import { z } from "zod";
import { isSessionValidAtom } from "./tomato-live-room";

const chatInputSchema = z.object({
    message: z.string().min(1).max(200),
});

type chatInputSchemaType = z.infer<typeof chatInputSchema>;

interface ChatInputProps {
    currentUser: GroupUserWithProfile;
    tomatoTarget: Tables<"tomato_target"> | undefined;
}

export default function ChatInput({
    currentUser,
    tomatoTarget,
}: ChatInputProps) {
    const [isSessionValid] = useAtom(isSessionValidAtom);
    const { isWorkEnabled } = useWorkStatus();
    const {
        mutate,
        isPending: isSending,
        isError: isSendingError,
    } = useCreateChatMsg();

    const { toast } = useToast();

    const form = useForm<chatInputSchemaType>({
        resolver: zodResolver(chatInputSchema),
        defaultValues: {
            message: "",
        },
    });

    const onSubmit = (values: chatInputSchemaType) => {
        if (!isSessionValid) return;

        const msg = values.message.trim();
        form.reset();

        // Check if msg is only whitespace
        if (msg.length == 0) {
            return;
        }

        handleSend(msg);
    };

    const handleSend = (message: string) => {
        if (!tomatoTarget || !currentUser || !isSessionValid || !isWorkEnabled)
            return;

        mutate(
            [
                {
                    message: message,
                    group_user_id: currentUser.id,
                    group_id: tomatoTarget.group_id,
                    tomato_target_id: tomatoTarget.id,
                },
            ],
            {
                onError: (error) => {
                    toast({
                        title: "Error sending message",
                        description: error.message,
                        variant: "destructive",
                    });
                },
            }
        );
    };

    return (
        <div className="flex gap-3 items-center mx-auto w-fit">
            {currentUser.profile && (
                <UserAvatar user={currentUser.profile} size={"sm"} />
            )}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex gap-3 items-center"
                >
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="p-0 m-0 h-fit  relative space-y-0">
                                <FormLabel className="sr-only">
                                    Message
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="max-w-[15rem] md:max-w-[28rem] min-w-[15rem] md:min-w-[28rem] border"
                                        placeholder="Add comment..."
                                        {...field}
                                        disabled={!isSessionValid}
                                    />
                                </FormControl>
                                <FormMessage className="absolute text-xs" />
                            </FormItem>
                        )}
                    />
                    <SpinnerButton
                        className="px-3"
                        disabled={
                            !tomatoTarget ||
                            isSending ||
                            isSendingError ||
                            form.getValues().message.length == 0 ||
                            !isSessionValid
                        }
                        isPending={isSending}
                    >
                        <ArrowUp className="size-4 " />
                    </SpinnerButton>
                </form>
            </Form>
        </div>
    );
}
