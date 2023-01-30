const express = require('express');
const router = express.Router();
const ExpensesDBObject = require('../models/Expenses');
const UsersDBObject = require('../models/Users');
const {getExpensesFromGmail} = require('../index')
const {costAssociation} = require('../utilities')

function getMailQueryDates(user) {
  const {lastConsultDate} = user
  const today = new Date()
  const [todayStringDate] = (today.toISOString()).split('T')
  const dates = { after: '', before: todayStringDate, needQuery: false };  
  if (lastConsultDate) {
      // when lastConsultDate exits compare with today date, if is up to date dont query mails
    if (lastConsultDate.toDateString() === today.toDateString()) {
      return dates;
    }
    // if is not up to date check if the last consult was in the actual month, and query from lastConsultDate to today if it was in the actual month
    if(today.getMonth() === lastConsultDate.getMonth()) {
      dates.needQuery = true
      const [lastConsultDateString] = (lastConsultDate.toISOString()).split('T')
      dates.after = lastConsultDateString
      return dates
    }
  }
  // if lastConsultDate was not in the actual month, query the mails from day 1 of the month to Today date
  const firstDayOfTheMonth = new Date()
  firstDayOfTheMonth.setDate(1)
  const [firstDayOfTheMonthString] = (firstDayOfTheMonth.toISOString()).split('T')
  dates.after = firstDayOfTheMonthString
  dates.needQuery = true
  return dates;
}

async function uploadExpensesFromMail(expenses, userId) {
  const expensesMap = expenses.map(data => {
    return {
      user: userId,
      ...data
    }
  })
  try {
    await ExpensesDBObject.insertMany(expensesMap)
  } catch (err) {
    console.log(err)
    return err;
  }
}
router.get('/:userId', async (req, res) => {
  try {
    const user = await UsersDBObject.findOne({ _id: req.params.userId });
    const queryDates = getMailQueryDates(user);
    if (queryDates.needQuery) {
      const expensesFromGmail = await getExpensesFromGmail(queryDates)
        await uploadExpensesFromMail(expensesFromGmail, user._id)
    }
    user.lastConsultDate =  (new Date())
    user.save()
    const expenses = await ExpensesDBObject.find({ user: req.params.userId });
    // update user last request if success
    res.json(expenses);
  } catch (err) {
    console.log(err)
    res.json({ message: err });
  }
});

router.get('/resume/:userId', async (req, res) => {
  try {
    const expenses = await ExpensesDBObject.find({ user: req.params.userId });
    const expensesResume = costAssociation(expenses)
    res.json(expensesResume);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post('/', async (req, res) => {
  const { user, budgetCategory, amount, business, status, bank } = req.body;
  const expenses = new ExpensesDBObject({
    user,
    budgetCategory,
    amount,
    business,
    status,
    bank,
    pureFromMail: true,
  });
  try {
    const savePost = await expenses.save();
    res.json(savePost);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put('/addToCategory/:id', async (req, res) => {
  const { budgetCategory } = req.body;
  try {
    const updateExpenses = await ExpensesDBObject.updateOne(
      { _id: req.params.id },
      {
        $set: {
          budgetCategory,
        },
      }
    );
    res.json(updateExpenses);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
