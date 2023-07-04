const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
// customerId :{type: Int , required: true},
customerName :{type: String , required: true},
customerPhone :{type: String , required: true},
customerEmail :{type: String , required: true},
customerAddress :{type: String , required: true},
password :{type: String , required: true},
},
{ timestamps: true}
);

module.exports = mongoose.model('User', userSchema, 'users');