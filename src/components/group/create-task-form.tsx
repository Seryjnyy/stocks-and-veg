import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import useWorkStatus from "@/hooks/use-work-status";
import { CONFIG } from "@/lib/config";
import { useCreateTask } from "@/lib/hooks/mutations/use-create-task";
import { GroupUserWithProfile } from "@/lib/hooks/queries/use-get-group-users";
import { GenericFormProps } from "@/lib/types";
import SpinnerButton from "@/spinner-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const taskSchema = z.object({
    name: z.string().min(2).max(50).regex(/\S+/, {
        message: "Name cannot be just whitespace characters.",
    }),
    desc: z.string().max(200),
});

type taskSchemaType = z.infer<typeof taskSchema>;

interface CreateTaskFormProps extends GenericFormProps {
    groupUser: GroupUserWithProfile;
}

export default function CreateTaskForm({
    groupUser,
    onError,
    onSuccess,
    disabled,
}: CreateTaskFormProps) {
    const { session } = useAuth();
    const { toast } = useToast();
    const form = useForm<taskSchemaType>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            name: "",
            desc: "",
        },
    });
    const isWorkEnabled = useWorkStatus();
    const { mutateAsync, isPending } = useCreateTask();

    const onSubmit = (values: taskSchemaType) => {
        console.log(values);
        if (!session || !isWorkEnabled) return;

        mutateAsync(
            [
                {
                    name: values.name.trim(),
                    desc: values.desc.trim(),
                    group_id: groupUser.group_id,
                    group_user_id: groupUser.id,
                    user_id: session.user.id,
                },
            ],
            {
                onSuccess: () => {
                    toast({
                        title: "Successfully created task.",
                    });

                    onSuccess?.();
                    form.reset();
                },
                onError: (error) => {
                    toast({
                        title: "Something went wrong.",
                        description: error.message,
                        variant: "destructive",
                    });

                    onError?.();
                },
            }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    disabled={isPending}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={
                                        disabled || isPending || !isWorkEnabled
                                    }
                                />
                            </FormControl>
                            <FormDescription className="sr-only">
                                This is will be the task's name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="desc"
                    disabled={isPending}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Desc</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={
                                        disabled || isPending || !isWorkEnabled
                                    }
                                />
                            </FormControl>
                            <FormDescription className="sr-only">
                                Add a description to the task if you need it.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <SpinnerButton
                        isPending={isPending}
                        disabled={isPending || disabled}
                        type="submit"
                    >
                        <Plus className="size-3 mr-2" /> Add task
                    </SpinnerButton>
                </div>
            </form>
        </Form>
    );
}
