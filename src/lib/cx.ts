import { twMerge } from "tailwind-merge";

/**
 * cn is a wrapper around cx that adds support for TailwindCSS classes.
 * @param inputs
 * @returns
 */
export const cn = (...inputs: CXValue[]) => twMerge(cx(...inputs));

export type CXValue =
  | CXDictionary
  | string
  | number
  | boolean
  | undefined
  | null;
type CXDictionary = Record<string, unknown>;
/**
 * cx is a tiny and fast utility for conditionally joining class names together.
 * @param args
 * @returns
 */
export const cx = (...args: CXValue[]) => {
  let str = "";
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg) {
      if (typeof arg === "object") {
        for (const key in arg) {
          if (arg[key]) {
            if (str) str += " ";
            str += key;
          }
        }
      } else {
        if (str) str += " ";
        str += arg;
      }
    }
  }
  return str;
};
type OmitUndefined<T> = T extends undefined ? never : T;
type StringToBoolean<T> = T extends "true | false" ? boolean : T;
type ClassProp = {
  className?: CXValue;
};
export type VariantProps<Component extends (...args: never[]) => unknown> =
  Omit<OmitUndefined<Parameters<Component>[0]>, "className">;
type CVConfigSchema = Record<string, Record<string, CXValue>>;
type CVConfigVariants<T extends CVConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};
export type CVConfig<T> = T extends CVConfigSchema
  ? {
      variants?: T;
      defaultVariants?: CVConfigVariants<T>;
    }
  : never;

export type CVProps<T> = T extends CVConfigSchema
  ? CVConfigVariants<T> & ClassProp
  : ClassProp;
/**
 * cv is designed to be a more flexible definition of cx/cn that allows for the use of variants.
 * @param base base styles
 * @param config override style configurations
 * @returns
 */
export const cv =
  <T>(base?: CXValue, config?: CVConfig<T>) =>
  (props?: CVProps<T>) => {
    if (config?.variants == null) return cn(base, props?.className);

    const { variants, defaultVariants } = config;
    const getVariantNames = Object.keys(variants).map(
      (v: keyof typeof variants) => {
        const vProps = props?.[v as keyof typeof props];
        // if vProps is null, unset the variant
        if (vProps === null) return null;
        // if vProps is undefined, set the default variant. otherwise set the variant
        // (so falsy values use as string)
        const vKey = (falsyToString(vProps) ||
          falsyToString(
            defaultVariants?.[v],
          )) as keyof (typeof variants)[typeof v];
        return variants[v][vKey];
      },
    );

    return cn(base, ...getVariantNames, props?.className);
  };
const falsyToString = <T>(value: T) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
