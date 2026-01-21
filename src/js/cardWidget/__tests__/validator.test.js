import validate from "../validator";

test.each([
  ["4275 8318 0246 1372", false],
  ["4276 8440 2783 3693", false],
  ["4275 8318 0246 1377", true],
  ["4276 8440 2783 3696", true],
  ["01042-0172", true],
  ["0 1 0 4 2 0 1 7 2", true],
])("should test validator", (numString, expected) => {
  expect(validate(numString)).toBe(expected);
});
