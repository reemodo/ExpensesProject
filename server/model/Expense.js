const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const expenseSchema = new Schema({
    item :  String,
    amount: Number,
    date: { type: Date,
        set: function (dateString) {
          // Parse the date using Moment.js when setting in the database
          return moment(dateString, 'LLLL').toDate();
        }
    },
    group: String
})
const Expense = mongoose.model("expense", expenseSchema)

module.exports = Expense
