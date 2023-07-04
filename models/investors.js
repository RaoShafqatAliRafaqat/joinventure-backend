const mongoose = require('mongoose');

const {Schema} = mongoose;

const investorSchema = new Schema({
//  investorId :{type: Int , required: true },
 projectId :{type: mongoose.SchemaTypes.ObjectId, ref:'Project' },
 customerId :{type: mongoose.SchemaTypes.ObjectId, ref:'User' },
 amount :{type: Number , required: true},
 investorName :{type: String , required: true},
},
{ timestamps: true}
);

module.exports = mongoose.model('Investor', investorSchema, 'investors');