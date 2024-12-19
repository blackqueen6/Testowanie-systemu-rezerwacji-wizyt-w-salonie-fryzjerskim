module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)",
        "**/?(*.)+(spec|test).mjs"
    ],
};