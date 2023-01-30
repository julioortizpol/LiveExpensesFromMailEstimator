const base64 = require('js-base64');


function decodeMailMessage(body) {
    return base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'));
  }
  
  function costAssociation(data){
    try{
      const businessTotalCost = {}
      data?.forEach(element => {
        const cost  = element?.amount?.replace("DOP","").replace("RD$","").replaceAll(",","")*1
        if(businessTotalCost[element.business] && !(isNaN(businessTotalCost[element.business]?.amount))){
          businessTotalCost[element.business].amount = businessTotalCost[element.business].amount + cost
        }else {
          businessTotalCost[element.business] = {amount: cost, currency: element?.currency}
        }
      })
      return businessTotalCost
    } catch(err){
      console.log(err)
    }
  }

  module.exports = {
    decodeMailMessage,
    costAssociation
  }