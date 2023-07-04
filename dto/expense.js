class ExpenseDTO{
    constructor(expense){
     this._id = expense._id;
     this.createdAt = expense.createdAt;
     this.amount = expense.amount;
     this.expenseName = expense.expenseName;
     this.expenseAuthor = expense.projectOwner.customerName
    }
}

module.exports = ExpenseDTO;