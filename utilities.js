const base64 = require('js-base64');


function decodeMailMessage(body) {
    return base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'));
  }
  
  function costAssociation(data){
    const businessTotalCost = {}
    data.forEach(element => {
      const cost  = element?.amount?.replace("DOP","").replace("RD$","").replaceAll(",","")*1
      if(isNaN(businessTotalCost[element.business])){
        businessTotalCost[element.business] = cost
      }else {
        businessTotalCost[element.business] = businessTotalCost[element.business] + cost
      }
    })
    console.log(businessTotalCost)
  }

  module.exports = {
    decodeMailMessage,
    costAssociation
  }