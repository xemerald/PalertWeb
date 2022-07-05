export interface Station {
	station: string;
	serial: number;
	area: string;
	locname: string;
	floors: number;
	latitude: number;
	longitude: number;
};

export interface StationExchange {
	tag: string;
	total: number;
	station: Array<string>;
};
