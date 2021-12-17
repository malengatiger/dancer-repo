import mongoose from 'mongoose';

const RoutePairSchema = new mongoose.Schema(
    {
        routePairID: {type: String, required: true, trim: true, index: true},
        routeID1: {type: String, required: true, trim: true, index: true},
        routeID2: {type: String, required: true, trim: true, index: true},
        routeName1: {type: String, required: true, },
        routeName2: {type: String, required: true},
        associationID: {type: String, required: true},
        associationName: {type: String, required: true},
            
        created: {type: String, required: true, default: new Date().toISOString()},
        updated: {type: String, required: false},

    }
);
RoutePairSchema.indexes().push({routePairID: 1});
RoutePairSchema.indexes().push({routeID1: 1});
RoutePairSchema.indexes().push({routeID2: 1});
const RoutePair = mongoose.model('RoutePair', RoutePairSchema);
export default RoutePair