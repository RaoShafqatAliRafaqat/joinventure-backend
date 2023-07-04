const Joi = require('joi');
const Expense = require('../models/expenses');
const ExpenseDto = require('../dto/expense');

const mongodbIdPattern = /^[0-91-fA-F]{24}$/;

const expenseController = {
async create(req, res, next){
      const createExpenseSchema = Joi.object({
        projectId: Joi.string().regex(mongodbIdPattern).required(),
        projectOwner: Joi.string().regex(mongodbIdPattern).required(),
        expenseName:  Joi.string().required(),
        amount: Joi.number().required()
      });

      const {error} = createExpenseSchema.validate(req.body);

      if(error){
        return next(error);
      }

      const {projectId, projectOwner, expenseName, amount} = req.body;

      try {
        const newExpense = new Expense({
            projectId, projectOwner, expenseName, amount
        });

        await newExpense.save();
      } catch (error) {
        return next(error);
      }

     return res.status(200).json({message: "Expense added successfully!"});
},
async getById(req, res, next){

    const getByIdSchema = Joi.object({
        id: Joi.string().regex(mongodbIdPattern).required()
    });

    const {error} = getByIdSchema.validate(req.params);

    if(error){
        return next(error);
    }

    const {id} = req.params;

    let expenses;
    try {
        expenses = await Expense.find({projectId: id}).populate('projectOwner');
    } catch (error) {
        return next(error);
    }
    let expensesDto = [];
    for(let i = 0; i< expenses.length; i++){
        const obj = new ExpenseDto(expenses[i]);
        expensesDto.push(obj);
    }

    return res.status(200).json({data: expensesDto})
}

}

module.exports = expenseController;