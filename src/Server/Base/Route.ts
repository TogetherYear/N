import { TRoute } from '../Decorators/TRoute';
import { Entity } from './Entity';

@TRoute.Generate()
class Route extends Entity {}

export { Route };
