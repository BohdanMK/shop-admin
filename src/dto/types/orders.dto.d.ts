export type DeliveryType = 'pickup' | 'courier';
export type DeliveryTime = 'asap' | 'scheduled';

export interface IOrderInfoDTO {
	_id?: string;
    name: string;
	phone: string;
	street: string;
	house: string;
	cityId?: string;
	cityName?: string;
	deliveryType: DeliveryType;
	deliveryTime: DeliveryTime;
	date: Date;
	time: string;
	birthdayDiscount: boolean;
	comment?: string;
	valuePerson: number;
	agreePolicy: boolean;
    status: 'pending' | 'confirmed' | 'processing';
	createdAt?: string;
	cartSnapshot: {
		items: {
			productId: string;
			title: string;
			price: {
				amount: number;
				currency: string;
			};
			quantity: number;
		}[];
		totalPrice: number;
	};
}

