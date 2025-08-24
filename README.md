# obsu
## A Testing Framework

A modern JavaScript testing framework built with class fields and clean error reporting. Features:
- Chainable assertions (.toBe(), .toBeNull(), .toBeInstanceOf())
- Function error testing with .toThrow()
- Tree-style error output formatting
- Automatic test reporting
- Private class implementation
- Zero dependencies
- Clean and minimal API

Example:

```js
obsu.test("sum should work", () => {
  obsu.expect(1 + 1).toBe(2)
})

obsu.test("should handle errors", () => {
  obsu.expect(() => { throw new Error() }).toThrow()
})
```
