import { ObjectStatus } from "./ObjectStatus";

export class ServiceObject {
    private id: string;
    private createdAt: Date;
    private lastModifiedAt: Date;
    protected updatedAt: Date;
    private enable: boolean;
    private status: ObjectStatus;

    public getStatus(): ObjectStatus {
        return this.status;
    }

    public setStatus(status: ObjectStatus): void {
        this.status = status;
    }

    public isEnable(): boolean {
        return this.enable;
    }

    public setEnable(enable: boolean): void {
        this.enable = enable;
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public setCreatedAt(createdAt: Date): void {
        this.createdAt = createdAt;
    }

    public getLastModifiedAt(): Date {
        return this.lastModifiedAt;
    }

    public setLastModifiedAt(lastModifiedAt: Date): void {
        this.lastModifiedAt = lastModifiedAt;
        this.updatedAt = lastModifiedAt;
    }
}