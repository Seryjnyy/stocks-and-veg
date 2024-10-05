import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useCreateTask } from "@/lib/hooks/mutations/use-create-task";
import { useAuth } from "@/lib/hooks/use-auth";
import { GenericFormProps } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { title } from "process";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SpinnerFormButton from "../spinner-form-button";

const taskSchema = z.object({
    name: z.string().min(2).max(50).regex(/\S+/, {
        message: "Name cannot be just whitespace characters.",
    }),
    desc: z.string().max(200),
});

type taskSchemaType = z.infer<typeof taskSchema>;

interface CreateTaskFormProps extends GenericFormProps {
    groupID: string;
}

export default function CreateTaskForm({
    groupID,
    onError,
    onSuccess,
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

    const { mutateAsync, isPending } = useCreateTask({
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
    });

    const onSubmit = (values: taskSchemaType) => {
        // mutateAsync([{ name: values.name }]);

        console.log(values);
        if (!session) return;

        mutateAsync([
            {
                name: values.name.trim(),
                desc: values.desc.trim(),
                group_id: groupID,
                user_id: session.user.id,
            },
        ]);
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
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                This is will be the task name.
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
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                This is will be the task desc.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SpinnerFormButton isPending={isPending}>
                    Submit
                </SpinnerFormButton>
            </form>
        </Form>
    );
}
