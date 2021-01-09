import MD5 from '../lib/md5';

describe('MD5', () => {
  it('should return correct md5 hash for string', () => {
    const result1 = MD5('wykop-v2-typescript');
    expect(result1).toEqual('392caf39c7a63db6129640d1b44e0b6c');
    const result2 = MD5('%@@%$^^$%!@!123123123');
    expect(result2).toEqual('cd1a380a680933247c3cdbb29b4c74d3');
    const result3 = MD5('Hello Hello');
    expect(result3).toEqual('25b9ff8631b988e1994ced03c8342b64');
    const result4 = MD5('');
    expect(result4).toEqual('d41d8cd98f00b204e9800998ecf8427e');
    const result5 = MD5(
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
    );
    expect(result5).toEqual('57edf4a22be3c955ac49da2e2107b67a');
  });
});
