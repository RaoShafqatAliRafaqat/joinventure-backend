const { number } = require('joi');
const mongoose = require('mongoose');

const {Schema} = mongoose;

const expenseSchema = new Schema({
    // expId :{type: Int , required: true },
 projectId : {type: mongoose.SchemaTypes.ObjectId, ref:'Project' },
 projectOwner :{type: mongoose.SchemaTypes.ObjectId , ref:'User'},
 expenseName :{type: String , required: true},
 amount : {type: Number , required: true},
},
{ timestamps: true}
);

module.exports = mongoose.model('Expense', expenseSchema, 'expenses');