import mongoose, { type Document, Schema } from 'mongoose';

// Interfaces
// interface ICoordinates {
// 	type: 'Point';
// 	coordinates: [number, number]; // [longitude, latitude]
// }

// interface IRegion extends Document {
// 	name: string;
// 	country: string;
// 	continent: string;
// 	boundary: ICoordinates[];
// 	subRegions: ISubRegion[];
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// interface ISubRegion extends Document {
// 	name: string;
// 	center: ICoordinates;
// 	boundary: ICoordinates[];
// 	gyms: IGym[];
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// interface IGym extends Document {
// 	name: string;
// 	location: ICoordinates;
// 	address?: string;
// 	phone?: string;
// 	isActive: boolean;
// }

// // Schemas
// const CoordinatesSchema = new Schema({
// 	type: {
// 		type: String,
// 		enum: ['Point'],
// 		required: true,
// 		default: 'Point',
// 	},
// 	coordinates: {
// 		type: [Number],
// 		required: true,
// 		validate: {
// 			validator: (coords: number[]) =>
// 				coords.length === 2 &&
// 				coords[0] >= -180 &&
// 				coords[0] <= 180 &&
// 				coords[1] >= -90 &&
// 				coords[1] <= 90,
// 			message: 'Coordinates must be valid [longitude, latitude]',
// 		},
// 	},
// });

// const GymSchema = new Schema(
// 	{
// 		name: { type: String, required: true },
// 		location: {
// 			type: CoordinatesSchema,
// 			required: true,
// 			index: '2dsphere', // Enables geospatial queries
// 		},
// 		address: String,
// 		phone: String,
// 		isActive: { type: Boolean, default: true },
// 	},
// 	{
// 		timestamps: true,
// 	},
// );

// const SubRegionSchema = new Schema(
// 	{
// 		name: { type: String, required: true },
// 		center: {
// 			type: CoordinatesSchema,
// 			required: true,
// 			index: '2dsphere',
// 		},
// 		boundary: {
// 			type: [CoordinatesSchema],
// 			required: true,
// 			validate: {
// 				validator: (coords: ICoordinates[]) => coords.length >= 3,
// 				message: 'Boundary must have at least 3 points to form a polygon',
// 			},
// 		},
// 		gyms: [GymSchema],
// 	},
// 	{
// 		timestamps: true,
// 	},
// );

// const RegionSchema = new Schema(
// 	{
// 		name: { type: String, required: true },
// 		country: { type: String, required: true },
// 		continent: { type: String, required: true },
// 		boundary: {
// 			type: [CoordinatesSchema],
// 			required: true,
// 			validate: {
// 				validator: (coords: ICoordinates[]) => coords.length >= 3,
// 				message: 'Boundary must have at least 3 points to form a polygon',
// 			},
// 		},
// 		subRegions: [SubRegionSchema],
// 	},
// 	{
// 		timestamps: true,
// 	},
// );

// // Indexes
// RegionSchema.index({ country: 1 });
// RegionSchema.index({ boundary: '2dsphere' });
// SubRegionSchema.index({ boundary: '2dsphere' });
// GymSchema.index({ location: '2dsphere' });

// // Models
// export const Region = mongoose.model<IRegion>('Region', RegionSchema);
// export const SubRegion = mongoose.model<ISubRegion>(
// 	'SubRegion',
// 	SubRegionSchema,
// );
// export const Gym = mongoose.model<IGym>('Gym', GymSchema);
