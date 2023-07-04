const mongoose = require('mongoose');

const {Schema} = mongoose;

const reportSchema = new Schema({
//  reportId :{type: Int , required: true },
 projectId :{type: mongoose.SchemaTypes.ObjectId, ref:'Project' },
 customerId :{type: mongoose.SchemaTypes.ObjectId, ref:'User' },
 totalInvestment :{type: Number , required: true},
 totalExp:{type: Number , required: true},
 sellingPrice:{type: Number , required: true},
 profit :{type: Number , required: true},
 percentageInvested :{type: Double , required: true},
 projectDes :{type: String , required: true},
},
{ timestamps: true}
);

module.exports = mongoose.model('Report', reportSchema, 'reports');