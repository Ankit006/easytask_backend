export async function promiseResolver(promise: () => Promise<any>) {
  const result = [null, null];
  try {
    result[0] = await promise();
    return result;
  } catch (err: any) {
    result[1] = err;
    return result;
  }
}
