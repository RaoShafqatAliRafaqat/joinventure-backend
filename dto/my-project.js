class MyProjectDTO{
    constructor(project){
        this._id = project._id,
     this.projectName = project.projectName,
     this.projectDes = project.projectDes,
     this.projectOwner = project.projectOwner._id
    }
}

module.exports = MyProjectDTO;