const express = require("express")
const router = express.Router()
const Expense = require('../model/Expense.js')
const moment = require('moment')
const expensesJsonData = require('../../expenses.json')

//Routes
router.post('/', function (req, res) {
    Expense.insertMany(expensesJsonData).then(() => {
        Expense.find({}).then(() => {
            res.end()})
    })
})
router.get('/expenses/:group', function(req, res){
    const group = req.params.group
    const total = req.query.total
    if(total === "true"){
        Expense.aggregate([{$match:{group: group}},{$group: { _id: "$group" ,  count: { $sum: "$amount" }}}]).then( (expense) =>{
            res.send(expense)
        })
    }
    else 
        Expense.find({group: group}).then( (expense) =>{
            res.send(expense)
        }
       
    )
})
router.get('/expenses', function(req, res){
    const date1 = req.query.date1 
    const date2 = req.query.date2 || new Date().toISOString();
    if(date1 != undefined & date2 != undefined){
        Expense.find( {date: {$gt: date1, $lt: date2} }).then((data) => {
            res.send(data)})
    }
    else Expense.find({}).then((data) => {
        res.send(data)})
    
})

router.post('/expenses', function(req, res){
    const newExpenseData = req.body
    const newExpense = new Expense(newExpenseData)
    newExpense.save().then((data) => {
        console.log(`The amount of the expense: ${data.amount} and what you spent your money on ${data.item}`)
        res.end()})
})

router.put('/update/:group1/:group2', function(req, res){
    const group1 = req.params.group1
    const group2 = req.params.group2
    Expense.findOneAndUpdate({group: group1},{group : group2},{new: true}).then( (expense) =>{
        console.log(`The item of the expense: ${expense.item} changed to group ${expense.group}`)
        res.end()
    }
       
    )
})


module.exports = router


// app.put('/person/:id', function (req, res) {
//     const personId = req.params.id
//     Person.findByIdAndUpdate(personId,  { age: 80 }, { new: true }).then( function (person) {
//         console.log(person)
//     })
//     res.end()
// })
// app.post('/person', function (req, res) {
//     const personData = req.body.person
//     const newPerson = new Person (personData)
//     newPerson.save() 
//     res.end()
// })
// app.delete('/apocalypse', function (req, res) {
//     Person.deleteMany().then(function(){
//         console.log("Data deleted"); // Success
//     }).catch(function(error){
//         console.log(error); // Failure
//     });
//     Person.find({}).then( function (people) {
//         console.log(people)
//     })
//     res.end()
// })

