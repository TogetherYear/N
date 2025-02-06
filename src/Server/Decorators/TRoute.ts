import { Route } from '../Base/Route';
import express from 'express';

namespace TRoute {
    export const enum Methon {
        Get,
        Post
    }

    export type Request = express.Request;

    export type Response = express.Response;

    export function Generate() {
        return function <T extends new (...args: Array<any>) => Route>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TRoute_Generate_CreateMount();
                }

                private TRoute_Generate_CreateMount() {
                    //@ts-ignore
                    const mount = (this['tRoute_Mount_Need'] || []) as Array<{
                        funcName: string;
                        path: string;
                        methon: Methon;
                    }>;
                    for (let e of mount) {
                        if (e.methon === Methon.Get) {
                            this.ctx.LocalServer.app.get(e.path, (req, res, next) => {
                                try {
                                    //@ts-ignore
                                    this[`${e.funcName}`](req, res);
                                } catch (error) {
                                    next(error);
                                }
                            });
                        } else if (e.methon === Methon.Post) {
                            this.ctx.LocalServer.app.post(e.path, (req, res, next) => {
                                try {
                                    //@ts-ignore
                                    this[`${e.funcName}`](req, res);
                                } catch (error) {
                                    next(error);
                                }
                            });
                        }
                    }
                }
            };
        };
    }

    export function Mount(methon: Methon, path: string) {
        return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
            //@ts-ignore
            if (target['tRoute_Mount_Need']) {
                //@ts-ignore
                target['tRoute_Mount_Need'].push({
                    funcName: propertyKey,
                    path,
                    methon
                });
            } else {
                //@ts-ignore
                target['tRoute_Mount_Need'] = [{ path, funcName: propertyKey, methon }];
            }
        };
    }
}

export { TRoute };
