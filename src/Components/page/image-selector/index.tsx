import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import type { z } from "zod";
import {
  type FormSchema,
  IMAGE_TYPES,
  useImageSelectorForm,
} from "./useImageSelectorForm";

export const ImageSelector = () => {
  const form = useImageSelectorForm();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{data.answerSheet.item(0)?.name}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[340px]">
        <Card>
          <CardHeader>
            <CardTitle>画像選択</CardTitle>
            <CardDescription>画像を選択してください</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="answerSheet"
              render={() => (
                <FormItem>
                  <FormLabel>ファイル</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={IMAGE_TYPES.join(",")}
                      {...form.register("answerSheet")}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="space-x-4">
            <Button type="reset" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
