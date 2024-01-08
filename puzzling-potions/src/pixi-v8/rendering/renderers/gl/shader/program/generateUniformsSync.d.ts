import { UniformGroup } from '../../../shared/shader/UniformGroup';
import type { UniformsSyncCallback } from '../../../shared/shader/utils/createUniformBufferSync';
export declare function generateUniformsSync(group: UniformGroup, uniformData: Record<string, any>): UniformsSyncCallback;
