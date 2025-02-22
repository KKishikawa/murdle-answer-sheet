import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormImageSelector } from "@/components/ui/form-image-selector";
// import { toast } from "sonner";
import type { z } from "zod";
import { imageDetect } from "./image-detect";
import {
  DebuggerCanvases,
  createDebuggerCanvasesRef,
} from "./image-detect/debugger-canvases";
import {
  type FormSchema,
  IMAGE_TYPES,
  useImageSelectorForm,
} from "./useImageSelectorForm";

export const ImageSelector = () => {
  const form = useImageSelectorForm();
  const canvasWrapperRef = createDebuggerCanvasesRef();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    imageDetect(data.answerSheet.item(0), canvasWrapperRef);
    // toast("You submitted the following values:", {
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{data.answerSheet.item(0)?.name}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[340px]">
          <Card>
            <CardHeader>
              <CardTitle>画像選択</CardTitle>
              <CardDescription>画像を選択してください</CardDescription>
            </CardHeader>
            <CardContent>
              <FormImageSelector
                form={form}
                name="answerSheet"
                accept={IMAGE_TYPES.join(", ")}
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
      <DebuggerCanvases ref={canvasWrapperRef} />
    </>
  );
};
