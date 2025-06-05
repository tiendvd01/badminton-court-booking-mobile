export interface IResponse {
  statusCode: number;
  message: string;
}
export interface IUser {
    id?: number;
    name?: string;
    email: string;
    phone?: string;
    address?: string;
    role: string;
    avatar_url?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ILocation {
    id: number;
    name: string;
    address: string;
    description?: string;
    owner_id: number;
    min_shift_time: number;
    logo?: string;
    courts: ICourt[];
    owner: IUser;
    images: ILocationImage[];
}

export interface ICourt {
    id: number;
    name: string;
    location_id: number;
    description: string;
    is_active: boolean;
    price_table_id: number;
}

export interface ILocationImage {
    id: number;
    location_id: number;
    image_url: string;
}
