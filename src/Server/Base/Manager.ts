import { TManager } from '../Decorators/TManager';
import { Entity } from './Entity';

@TManager.Generate()
class Manager extends Entity {}

export { Manager };
