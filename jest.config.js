module.exports = {
    coverageDirectory: './docs/coverage',
    "coverageReporters": ["json", "lcov", "text", "clover","json-summary"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    setupFiles: ["jest-canvas-mock"]
};