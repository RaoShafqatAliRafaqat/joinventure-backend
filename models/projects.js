const mongoose = require('mongoose');

const {Schema} = mongoose;

const projectSchema = new Schema({
// projectId :{type: Int , required: true},
projectName :{type: String , required: true},
projectDes :{type: String , required: true},
projectOwner :{type: mongoose.SchemaTypes.ObjectId , ref:'User'},
},
{ timestamps: true}
);

module.exports = mongoose.model('Project', projectSchema, 'projects');