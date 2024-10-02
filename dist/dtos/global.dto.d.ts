declare class UpdateFieldDto {
    name: string;
    value: any;
}
export declare class UpdateActionDto {
    ids: Array<string>;
    field: UpdateFieldDto;
}
export declare class DeleteActionDto {
    ids: Array<string>;
}
export {};
