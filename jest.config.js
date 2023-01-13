const nextJest = require('next/jest')


const createJestConfig = nextJest({
    dir:'./'
})

const customJestConfig = {
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testEnvironment: "jest-environment-node",
    preset: "@shelf/jest-mongodb",
    globalSetup: "<rootDir>/testSettings/globalSetup.ts",
    globalTeardown: "<rootDir>/testSettings/globalTeardown.ts",
    // setupFilesAfterEnv: [
    //     "<rootDir>/testSettings/setupFile.ts"
    // ],
    maxWorkers : 4
}

module.exports = createJestConfig(customJestConfig);