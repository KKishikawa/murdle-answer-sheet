import { cn, cva, cx } from "@/lib/cxs";
import { describe, expect, it, test, vi } from "vitest";

describe("cx", () => {
  const fn = vi.fn(cx);
  test("strings", () => {
    expect(fn("")).toBe("");
    expect(fn("foo")).toBe("foo");
    expect(fn(true && "foo")).toBe("foo");
    expect(fn(false && "foo")).toBe("");
  });

  test("strings (variadic)", () => {
    expect(fn("")).toBe("");
    expect(fn("foo", "bar")).toBe("foo bar");
    expect(fn(true && "foo", false && "bar", "baz")).toBe("foo baz");
    expect(fn(false && "foo", "bar", "baz", "")).toBe("bar baz");
  });

  test("numbers", () => {
    expect(fn(1)).toBe("1");
    expect(fn(12)).toBe("12");
    expect(fn(0.1)).toBe("0.1");
    expect(fn(0)).toBe("");

    expect(fn(Number.POSITIVE_INFINITY)).toBe("Infinity");
    expect(fn(Number.NaN)).toBe("");
  });

  test("numbers (variadic)", () => {
    expect(fn(0, 1)).toBe("1");
    expect(fn(1, 2)).toBe("1 2");
  });

  test("objects", () => {
    expect(fn({})).toBe("");
    expect(fn({ foo: true })).toBe("foo");
    expect(fn({ foo: true, bar: false })).toBe("foo");
    expect(fn({ foo: "hiya", bar: 1 })).toBe("foo bar");
    expect(fn({ foo: 1, bar: 0, baz: 1, "your name is": {} })).toBe(
      "foo baz your name is",
    );
    expect(fn({ "-foo": 1, "--bar": 1 })).toBe("-foo --bar");
    expect(fn({ push: 1 })).toBe("push");
    expect(fn({ pop: true })).toBe("pop");
    expect(fn({ push: true })).toBe("push");
    expect(fn("hello", { world: 1, push: true })).toBe("hello world push");
  });

  test("objects (variadic)", () => {
    expect(fn({}, {})).toBe("");
    expect(fn({ foo: 1 }, { bar: 2 })).toBe("foo bar");
    expect(fn({ foo: 1 }, null, { baz: 1, bat: 0 })).toBe("foo baz");
    expect(
      fn(
        { foo: 1 },
        {},
        {},
        { bar: "a" },
        { baz: null, bat: Number.POSITIVE_INFINITY },
      ),
    ).toBe("foo bar bat");
  });
});

describe("cn", () => {
  it("should return last class if same style class", () => {
    expect(cn("h-4", "h-8")).toBe("h-8");
    expect(
      cn(
        "text-red-300",
        {
          "text-blue-300": true,
        },
        {
          "text-red-600": false,
        },
      ),
    ).toBe("text-blue-300");
  });
});

describe("cva", () => {
  it("should return class string", () => {
    const variants = cva("text-red-300", {
      variants: {
        size: {
          sm: "h-4",
          md: "h-8",
          lg: "h-12",
        },
      },
      defaultVariants: { size: "md" },
    });

    expect(variants()).toBe("text-red-300 h-8");
    expect(variants({ size: "sm" })).toBe("text-red-300 h-4");
    expect(variants({ size: "md" })).toBe("text-red-300 h-8");
    expect(variants({ size: "lg" })).toBe("text-red-300 h-12");
  });
  it("shoud empty string if no default variants", () => {
    const variants = cva("h-1/2", {
      variants: {
        "text-color": {
          red: "text-red-300",
          blue: "text-blue-300",
        },
      },
    });

    expect(variants()).toBe("h-1/2");
    expect(variants({ "text-color": "red" })).toBe("h-1/2 text-red-300");
    expect(variants({ "text-color": "blue" })).toBe("h-1/2 text-blue-300");
    // @ts-expect-error TS2322
    expect(variants({ "text-color": "green" })).toBe("h-1/2");
  });
});
