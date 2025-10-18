type SuccessResult<T> = readonly [T, null];
type ErrorResult<E = Error> = readonly [null, E];
type Result<T, E> = SuccessResult<T> | ErrorResult<E>;

export default async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const res = await promise;
    return [res, null] as const;
  } catch (e) {
    return [null, e as E] as const;
  }
}
