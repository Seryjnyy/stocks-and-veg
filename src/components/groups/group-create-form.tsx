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
import { useCreateGroup } from "@/lib/hooks/mutations/use-create-group";
import { GenericFormProps } from "@/lib/types";
import SpinnerButton from "@/spinner-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(2).max(50).regex(/\S+/, {
        message: "Name cannot be just whitespace characters.",
    }),
});

type formSchemaType = z.infer<typeof formSchema>;

export default function GroupCreateForm({
    onSuccess,
    onError,
}: GenericFormProps) {
    const { toast } = useToast();

    const { mutateAsync, isPending } = useCreateGroup({
        onSuccess: () => {
            toast({
                title: "Successfully created group.",
            });
            onSuccess?.();
        },
        onError: (e) => {
            toast({
                title: "Something went wrong.",
                description: e.message,
                variant: "destructive",
            });
            onError?.();
        },
    });

    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (values: formSchemaType) => {
        mutateAsync([{ name: values.name.trim() }]);
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
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                This is will be the group name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SpinnerButton isPending={isPending} disabled={isPending}>
                    Submit
                </SpinnerButton>
            </form>
        </Form>
    );
}
