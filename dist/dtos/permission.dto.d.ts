declare class RoleDTO {
    id: string;
    name: string;
}
declare class PermissionDTO {
    id: string;
    name: string;
}
export declare class UpdatePermissionRequestDto {
    value: number;
    role: RoleDTO;
    permission: PermissionDTO;
}
export {};
