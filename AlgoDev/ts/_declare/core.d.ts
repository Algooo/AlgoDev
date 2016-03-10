interface PromiseResolve {
    (value?: {} | PromiseLike<{}>): void;
}

interface PromiseReject {
    (reason?: any): void;
}