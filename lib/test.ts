export function assert(a: boolean): void {
  if (a) {
    console.log('ok');
  } else {
    throw new Error("fail");
  }
}
