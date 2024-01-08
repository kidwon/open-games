import type { BindResource } from './BindResource';
export declare class BindGroup {
    resources: Record<string, BindResource>;
    usageTick: number;
    key: string;
    private dirty;
    constructor(resources?: Record<string, BindResource>);
    update(): void;
    updateKey(): void;
    setResource(resource: BindResource, index: number): void;
    getResource(index: number): BindResource;
    destroy(): void;
    private onResourceChange;
}
