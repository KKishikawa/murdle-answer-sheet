import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const IMAGE_TYPES = ["image/jpeg", "image/png"];
const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024;

export const FormSchema = z.object({
  answerSheet: z
    .custom<FileList>()
    .refine(files => files.length === 1, {
      message: "画像ファイルの添付は必須です",
    })
    .refine(
      files => [...files].every(file => IMAGE_TYPES.includes(file.type)),
      {
        message: "画像ファイルの形式はjpegまたはpngのみ許可されています",
      },
    )
    .refine(files => [...files].every(file => file.size <= IMAGE_SIZE_LIMIT), {
      message: `画像ファイルのサイズは${IMAGE_SIZE_LIMIT / 1024 / 1024}MB以下にしてください`,
    }),
});

export const useImageSelectorForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return form;
};
