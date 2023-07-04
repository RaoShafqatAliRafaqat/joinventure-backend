class ProjectDetailsDTO{
    constructor(project){
        this._id = project._id,
     this.projectName = project.projectName,
     this.projectDes = project.projectDes,
     this.createdAt = project.createdAt,
     this.customerName = project.projectOwner.customerName,
     this.customerEmail = project.projectOwner.customerEmail
    }
}

module.exports = ProjectDetailsDTO;