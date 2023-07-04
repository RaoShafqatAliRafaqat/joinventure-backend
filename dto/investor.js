class InvestorDTO{
    constructor(investor){
        this._id = investor._id,
     this.projectId = investor.projectId,
     this.customerId = investor.customerId,
     this.amount = investor.amount
     this.investorName = investor.investorName
     this.createdAt = investor.createdAt
    }
}

module.exports = InvestorDTO;
