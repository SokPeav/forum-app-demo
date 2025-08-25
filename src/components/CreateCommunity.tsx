import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useSignInDialogStore } from "@/hooks/useSignInDialog";
import supabase from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BorderBeam } from "./magicui/border-beam";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
interface CommunityInput {
  name: string;
  description: string;
}
const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase.from("communities").insert(community);

  if (error) throw new Error(error.message);
  return data;
};

const CommunityFormValues = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
});
export const CreateCommunity = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/community/create" });
  const { user } = useAuth();
  const { openDialog } = useSignInDialogStore();

  const { mutate, isPending } = useMutation({
    mutationFn: (community: CommunityInput) => {
      console.log(community);
      if (!user) {
        openDialog();
        return Promise.reject(new Error("User not logged in"));
      }
      return createCommunity(community);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate({ to: "/communities" });
    },
  });
  const form = useForm<z.infer<typeof CommunityFormValues>>({
    resolver: zodResolver(CommunityFormValues),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const onSubmit = (value: z.infer<typeof CommunityFormValues>) => {
    const { name, description } = value;
    mutate({ name, description });
  };
  return (
    <Card className=" relative max-w-2xl mx-auto ">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-2xl mx-auto space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="description"
                      className=" resize-none  "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              {isPending ? "Creating..." : "Create Community"}
            </button>
            {/* {isError && <p className="text-red-500">Error creating community.</p>} */}
          </form>
        </Form>
      </CardContent>
      <BorderBeam
        duration={4}
        size={300}
        reverse
        className="from-transparent via-green-500 to-transparent"
      />
    </Card>
  );
};
