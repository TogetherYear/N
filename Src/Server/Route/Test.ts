import { join } from 'path';
import { Route } from '../Base/Route';
import { TRoute } from '../Decorators/TRoute';

class Test extends Route {
    @TRoute.Get('/test/get')
    private TestGet(req: TRoute.Request, res: TRoute.Response) {
        res.write('Get');
        res.end();
    }

    @TRoute.Post('/test/post')
    private TestPost(req: TRoute.Request, res: TRoute.Response) {
        res.write('Post');
        res.end();
    }

    @TRoute.Put('/test/put')
    private TestPut(req: TRoute.Request, res: TRoute.Response) {
        res.write('Put');
        res.end();
    }

    @TRoute.Delete('/test/delete')
    private TestDelete(req: TRoute.Request, res: TRoute.Response) {
        res.write('Delete');
        res.end();
    }
}

export { Test };
