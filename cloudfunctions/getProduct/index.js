const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const {
    garbage
  } = event
  return db.collection('product').where({
    name: garbage
  }).get()
}
