class UserDTO{
    constructor(user){
        this._id = user._id;
        this.customerName = user.customerName;
        this.customerEmail = user.customerEmail;
        this.customerPhone = user.customerPhone;
        this.customerAddress = user.customerAddress;
    }
}

module.exports = UserDTO;