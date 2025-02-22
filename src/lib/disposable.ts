export const disposable = <T extends object>(
  value: T,
  dispose: (value: T | undefined) => void,
) =>
  Object.assign(value, {
    [Symbol.dispose]() {
      dispose(this as T);
    },
  });
