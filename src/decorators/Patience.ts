namespace Patience {
    export function ES<T extends { new(...args: any[]): Object }>(C: T) {
        return class extends C {
            constructor(...args: any[]) {
                super(...args)
            }
            // ... Just do it ...
        }
    }
}
export { Patience }
