
export enum RoleUser {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN'
};


export interface UserBaseDto {
    name: string;
    email: string;
    role: RoleUser;
}

export interface UserDto extends UserBaseDto {
    id: number;
}

export interface TokenDto {
    token: string;
}