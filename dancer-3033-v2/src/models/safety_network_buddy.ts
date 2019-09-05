import mongoose from 'mongoose';
mongoose.set('debug', true);

const SafetyNetworkBuddySchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        cellPhone: {type: String, required: true},
        relationship: {type: String, required: true, enum: ['Mother', 'Father', 'Son', 'Daughter', 'Aunt', 'Uncle', 'Cousin', 'Gran Dad', 'Gran Mother', 'Niece', 'Nephew', 'Friend', 'Colleague', 'Wife', 'Husband', 'Spouse']},
        userID: {type: String, required: false},

        created: {type: String, required: true, default: new Date().toISOString()},
    }
);


const SafetyNetworkBuddy = mongoose.model('SafetyNetworkBuddy', SafetyNetworkBuddySchema);
export default SafetyNetworkBuddy;