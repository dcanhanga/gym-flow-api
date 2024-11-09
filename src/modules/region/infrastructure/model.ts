import { randomUUID } from 'node:crypto';
import mongoose, { Schema } from 'mongoose';

const regionSchema = new Schema({
	id: {
		type: String,
		default: () => randomUUID(),
	},
	name: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	midpoint: {
		type: {
			type: String,
			enum: ['Point'],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	coordinates: {
		type: {
			type: String,
			enum: ['Polygon'],
			required: true,
		},
		coordinates: {
			type: [[[Number]]],
			required: true,
		},
	},
});

export const Region = mongoose.model('Region', regionSchema);

regionSchema.index({ midpoint: '2dsphere' });
regionSchema.index({ coordinates: '2dsphere' });
