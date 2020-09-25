import { getConfigAccessPath } from './config.util';
describe('utils: config', ()=>{
  it('getConfigAccessPath should have correct behavior', () => {

    expect(getConfigAccessPath(['a'])).toBe('');

    expect(getConfigAccessPath(['a', 'b', 'c'])).toBe('b.c');
    expect(getConfigAccessPath(['a', 'b', 'c'], '.')).toBe('b.c');

    expect(getConfigAccessPath(['a', 'b', 'c'], '..')).toBe('b');
    expect(getConfigAccessPath(['a', 'b', 'c'], '../..')).toBe('');
    expect(getConfigAccessPath(['a', 'b', 'c'], '../../..')).toBe('');
    expect(getConfigAccessPath(['a', 'b', 'c'], '../../../../')).toBe('');

    expect(getConfigAccessPath(['a', 'b', 'c', 'd', 'e'], '../test')).toBe('b.c.d.test');

    expect(getConfigAccessPath(['a', 'b', 'c'], '/')).toBe('');
    expect(getConfigAccessPath(['a', 'b', 'c'], '/b')).toBe('b');
  })
})
