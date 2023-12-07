export function isAsyncFunction(func: Function) {
  const AsyncFunction = (async () => {}).constructor;
  return func instanceof AsyncFunction;
}

export function isPromiseFunction(func: Function) {
  return (
    func && typeof func === "function" && func.prototype instanceof Promise
  );
}

export function isAsyncFunc(func: Function) {
  return isAsyncFunction(func) || isPromiseFunction(func);
}
