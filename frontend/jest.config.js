module.exports = {
  testEnvironment: "node", // plain functions don't need jsdom
  moduleFileExtensions: ["js", "ts", "tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // if using TS
  },
};
