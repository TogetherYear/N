import { Route } from '../Base/Route';
import { TRoute } from '../Decorators/TRoute';

class Update extends Route {
    @TRoute.Mount(TRoute.Methon.Get, '/update/get')
    private TestGet(req: TRoute.Request, res: TRoute.Response) {
        res.write('Get');
        res.end();
    }

    @TRoute.Mount(TRoute.Methon.Post, '/update/post')
    private TestPost(req: TRoute.Request, res: TRoute.Response) {
        res.write('Post');
        res.end();
    }
}

export { Update };
