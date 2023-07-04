const Joi = require('joi');
const Investor = require('../models/investors');
const InvestorDTO = require('../dto/investor')

const mongodbIdPattern = /^[0-91-fA-F]{24}$/;
const investorController = {


    async create(req, res, next){

        //1. validate req body
        const createInvestorchema = Joi.object({
            projectId: Joi.string().regex(mongodbIdPattern).required(),
            customerId: Joi.string().regex(mongodbIdPattern).required(),
            amount: Joi.number().required(),
            investorName: Joi.string().required()
        });
        const {error} = createInvestorchema.validate(req.body);
        if(error){
            return next(error);
        }

            const {projectId, customerId, amount, investorName} = req.body;

        //2. add to db
        let newInvestor;
        try {
            newInvestor = new Investor({
            projectId,
            customerId,
            amount,
            investorName
            });

            await newInvestor.save();

        } catch (error) {
            return next(error);
        }
        //3. return response
        const investorDto = new InvestorDTO(newInvestor);
        return res.status(201).json({investor: investorDto});
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
    
        let investors;
        try {
            investors = await Investor.find({projectId: id});
        } catch (error) {
            return next(error);
        }
        let investorsDto = [];
        for(let i = 0; i< investors.length; i++){
            const obj = new InvestorDTO(investors[i]);
            investorsDto.push(obj);
        }
    
        return res.status(200).json({data: investorsDto})
    }
    

}

module.exports = investorController;