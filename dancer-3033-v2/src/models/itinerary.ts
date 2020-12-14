import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const ItinerarySchema = new mongoose.Schema(
    {
        itineraryID: {type: String, required: true, unique: true},
        position: {type: Map, required: true},
        routes: {type: Array, required: true, default: []},
        destinationCities: {type: Array, required: true, default: []},
        landmarks: {type: Array, required: true, default: []},
        associationName: {type: String, required: true, trim: true},
        associationID: {type: String, required: true, trim: true},
        websiteUrl: {type: String, required: false, trim: true },
        fare: {type: Number, required: false, default: 0 },
        created: {type: String, required: true, default: new Date().toISOString()},

    }
);

mongoose.set('useCreateIndex', true)
ItinerarySchema.plugin(uniqueValidator);
ItinerarySchema.indexes().push({position: '2dsphere'})
ItinerarySchema.indexes().push({associationID: 1});
ItinerarySchema.indexes().push({'destinationCities.cityID': 1});
ItinerarySchema.indexes().push({'landmarks.landmarkID': 1});
ItinerarySchema.indexes().push({'routes.routeID': 1});

const Itinerary = mongoose.model('Itinerary', ItinerarySchema);
export default Itinerary;