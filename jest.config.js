module.exports = {
    coverageDirectory:'./docs/coverage',
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    setupFiles: ["jest-canvas-mock"]
};