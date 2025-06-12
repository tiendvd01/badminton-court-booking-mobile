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
    image_url?: string;
    is_active: boolean;
    location?: ILocation;
    price_table_id: number;
    priceTable?: IPriceTable;
}

export interface ILocationImage {
    id: number;
    location_id: number;
    image_url: string;
}

export interface IPriceTable {
    id: number;
    name: string;
    description?: string;
    owner_id: number;
    owner?: {
        id: number;
        name: string;
        email: string;
        avatar_url: string;
    };
    prices: IPrice[];
    created_at?: string;
    updated_at?: string;
}

export interface IPrice {
    start_time: string;
    end_time: string;
    price: number;
}

export interface IBooking {
    id: number;
    customer_info: {
        name: string;
        phone_number: string;
    };
    booking_code: string;
    booking_date: string;
    slots: {
        court_id: number;
        start_time: string;
        end_time: string;
    }[];
    total_price: number;
    note?: string;
    status: string;
    payment_image?: string;
    created_at: string;
    updated_at: string;
}

export interface IOwnerPayment {
    id: number;
    account_name: string;
    payment_number: string;
    bank_info: BankInfo;
    bank_code: string;
    owner_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


export interface BankInfo {
    id: string;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
    short_name: string;
    support: number;
    isTransfer: number;
    swift_code: string;
  }
  
