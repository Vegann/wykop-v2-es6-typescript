export default class MockFile {
  public static create(_size?: number) {
    const size = _size || 10;
    const array: string[] = new Array(size).fill('X');
    const blob = Buffer.from(array);

    return blob;
  }
}
