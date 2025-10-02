/// <reference types="jest" />

declare global {
    namespace jest {
        interface Mock<T = any, Y extends any[] = any[]> {
            new(...args: Y): T;
            (...args: Y): T;
            mockImplementation(fn: (...args: Y) => T): this;
            mockReturnValue(value: T): this;
            mockReturnThis(): this;
            mockResolvedValue(value: T): this;
            mockRejectedValue(error: any): this;
        }
    }

    var jest: typeof import('@jest/globals')['jest'];
    var expect: typeof import('@jest/globals')['expect'];
    var describe: typeof import('@jest/globals')['describe'];
    var it: typeof import('@jest/globals')['it'];
    var beforeEach: typeof import('@jest/globals')['beforeEach'];
    var afterEach: typeof import('@jest/globals')['afterEach'];
}