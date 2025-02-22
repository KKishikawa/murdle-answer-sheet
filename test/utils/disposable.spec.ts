import { disposable } from "@/lib/disposable";
import { describe, expect, it, vi } from "vitest";

describe("utils/disposable", () => {
  it("should dispose", () => {
    // Arrange
    const dispose = vi.fn();

    // Act
    (() => {
      using _ = disposable({}, dispose);
    })();

    // Assert
    expect(dispose).toHaveBeenCalled();
  });

  it("should dispose call with object", () => {
    // Arrange
    const dispose = vi.fn();
    const base = { foo: "bar" };

    // Act
    (() => {
      using _ = disposable(base, dispose);
    })();

    // Assert
    expect(dispose).toBeCalledWith(base);
  });

  it("should dispose call whenever prototype method", () => {
    const mock = vi.fn();
    class Base {
      foo = "bar";
      m() {
        mock(this);
      }
    }
    const base = new Base();
    (() => {
      using _ = disposable(base, v => v.m());
    })();
    expect(mock).toBeCalledWith(base);

    mock.mockClear();
    class Base2 extends Base {}
    const base2 = new Base2();
    (() => {
      using _ = disposable(base2, v => v.m());
    })();
    expect(mock).not.toBeCalledWith(base);
    expect(mock).toBeCalledWith(base2);
  });

  it("should not dispose if not using", () => {
    // Arrange
    const dispose = vi.fn();
    const base = { foo: "bar" };

    // Act
    (() => {
      disposable(base, dispose);
    })();

    // Assert
    expect(dispose).not.toHaveBeenCalled();
  });
  it("should keep inheritance", () => {
    class Base {
      foo = "bar";
    }
    class Derived extends Base {
      bar = "baz";
    }
    const dispose = vi.fn();
    const base = new Derived();
    (() => {
      using o = disposable(base, dispose);
      expect(o instanceof Derived).toBeTruthy();
      expect(o instanceof Base).toBeTruthy();
    })();
    expect(dispose).toBeCalledTimes(1);

    dispose.mockClear();
    (() => {
      using o = disposable(base, dispose);
      using o2 = Object.assign(o, {
        ez: "ez",
      });
      expect(o2 instanceof Derived).toBeTruthy();
      expect(o2 instanceof Base).toBeTruthy();
    })();
    expect(dispose).toBeCalledTimes(2);
  });
});
