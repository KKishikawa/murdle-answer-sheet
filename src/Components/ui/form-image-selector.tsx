import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

type PreviewImageProps = {
  fileList?: FileList | null;
};

export const PreviewImage = ({ fileList }: PreviewImageProps) => {
  // TBC: can preview multiple images
  const file = fileList?.item(0);
  return (
    <>
      {file ? (
        <img
          src={URL.createObjectURL(file)}
          alt="プレビュー画像"
          className="max-h-full max-w-full"
        />
      ) : (
        <p className="text-muted-foreground">画像を選択してください</p>
      )}
    </>
  );
};

type FormImageSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  accept?: string;
  multiple?: boolean;
};

export const FormImageSelector = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  accept,
  multiple,
}: FormImageSelectorProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>ファイル</FormLabel>
          <FormControl>
            <Input
              type="file"
              multiple={multiple}
              accept={accept}
              {...form.register(name)}
            />
          </FormControl>
          <FormDescription>
            <PreviewImage fileList={field.value} />
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
