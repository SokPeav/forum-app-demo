import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useSignInDialogStore } from "@/hooks/useSignInDialog";
import supabase from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fetchCommunities, type Community } from "./CommunityList";
import { BorderBeam } from "./magicui/border-beam";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
  op: string;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, new Blob([imageFile], { type: "image/*" }));
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};
function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const dataTransfer = new DataTransfer();
  Array.from(event.target.files!).forEach((image) =>
    dataTransfer.items.add(image)
  );

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}
const PostFormValues = z.object({
  title: z.string().nonempty({ message: "Title is required" }),

  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters long" }),

  community: z.string().min(1, { message: "Please select a community" }),

  image: z
    .any()
    .refine((files) => files?.length === 1, { message: "Image is required" })
    .refine((files) => files?.[0]?.type.startsWith("image/"), {
      message: "Only image files are allowed",
    }),
});

export const CreatePost = () => {
  const [preview, setPreview] = useState("");
  const { user } = useAuth();
  const { openDialog } = useSignInDialogStore();
  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      if (!user) {
        openDialog();
        return Promise.reject(new Error("User not logged in"));
      }
      return createPost(data.post, data.imageFile);
    },

    onSuccess: () => {
      redirect({
        to: "/",
        throw: true,
      });
    },
  });

  const form = useForm<z.infer<typeof PostFormValues>>({
    resolver: zodResolver(PostFormValues),
    defaultValues: {
      title: "",
      content: "",
      community: "",
      image: undefined,
    },
  });
  const onSubmit = (data: z.infer<typeof PostFormValues>) => {
    const { title, content, image, community } = data;
    if (!image) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        op: user?.user_metadata.user_name,
        community_id: Number(community),
      },
      imageFile: image[0],
    });
  };

  const getPreviewImage = form.getValues("image");
  return (
    <Card className=" relative max-w-2xl mx-auto ">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Title</FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      id="content"
                      placeholder="content"
                      className=" resize-none  "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="community"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Community</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Community" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {communities?.map((comm) => (
                        <SelectItem key={comm.id} value={String(comm.id)}>
                          {comm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel> Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...rest}
                      className="cursor-pointer"
                      onChange={(event) => {
                        const { files, displayUrl } = getImageData(event);
                        setPreview(displayUrl);
                        onChange(files);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {getPreviewImage && (
              <div className="mx-auto flex items-center justify-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={preview} />
                  <AvatarFallback>Preview</AvatarFallback>
                </Avatar>
              </div>
            )}
            <Button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              {isPending ? "Creating..." : "Create Post"}
            </Button>

            {/* {isError && <p className="text-red-500"> Error creating post.</p>} */}
          </form>
        </Form>
      </CardContent>
      <BorderBeam
        duration={6}
        size={200}
        className="from-transparent via-red-500 to-transparent"
      />
      <BorderBeam
        duration={6}
        delay={3}
        size={200}
        borderWidth={2}
        className="from-transparent via-blue-500 to-transparent"
      />
    </Card>

    // <Form {...form}>
    //     <form
    //       onSubmit={form.handleSubmit(onSubmit)}
    //       className=" max-w-2xl mx-auto space-y-4"
    //     >
    //       <FormField
    //         control={form.control}
    //         name="title"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel> Title</FormLabel>
    //             <FormControl>
    //               <Input placeholder="title" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         control={form.control}
    //         name="content"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Content</FormLabel>
    //             <FormControl>
    //               <Textarea
    //                 id="content"
    //                 placeholder="content"
    //                 className=" resize-none  "
    //                 {...field}
    //               />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         control={form.control}
    //         name="community"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel>Select Community</FormLabel>
    //             <Select
    //               onValueChange={field.onChange}
    //               defaultValue={field.value}
    //             >
    //               <FormControl className="w-full">
    //                 <SelectTrigger>
    //                   <SelectValue placeholder="Select a Community" />
    //                 </SelectTrigger>
    //               </FormControl>
    //               <SelectContent>
    //                 {communities?.map((comm) => (
    //                   <SelectItem key={comm.id} value={String(comm.id)}>
    //                     {comm.name}
    //                   </SelectItem>
    //                 ))}
    //               </SelectContent>
    //             </Select>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />

    //       <FormField
    //         control={form.control}
    //         name="image"
    //         render={({ field: { onChange, value, ...rest } }) => (
    //           <FormItem>
    //             <FormLabel> Image</FormLabel>
    //             <FormControl>
    //               <Input
    //                 type="file"
    //                 {...rest}
    //                 className="cursor-pointer"
    //                 onChange={(event) => {
    //                   const { files, displayUrl } = getImageData(event);
    //                   setPreview(displayUrl);
    //                   onChange(files);
    //                 }}
    //               />
    //             </FormControl>

    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       {getPreviewImage && (
    //         <div className="mx-auto flex items-center justify-center">
    //           <Avatar className="w-24 h-24">
    //             <AvatarImage src={preview} />
    //             <AvatarFallback>Preview</AvatarFallback>
    //           </Avatar>
    //         </div>
    //       )}
    //       <Button
    //         type="submit"
    //         className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
    //       >
    //         {isPending ? "Creating..." : "Create Post"}
    //       </Button>

    //       {isError && <p className="text-red-500"> Error creating post.</p>}
    //     </form>
    //   </Form>
  );
};
