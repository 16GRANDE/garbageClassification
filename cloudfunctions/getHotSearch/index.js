const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  if(event.type){
    return db.collection('hotsearch').where({
      type:event.type
    }).get()
  }else{
    return db.collection('hotsearch').get()
  }
}
