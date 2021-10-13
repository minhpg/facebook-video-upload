const got = require('got');
const qs = require('querystring')

module.exports = async (message) => {
    try {
        if (process.env.TELEGRAM_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            await got.get(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${qs.escape(message)}`).json()
         }
    }
    catch (err) {
        if(err.response) {
            console.error(err.response.body)
        }
        else {
            console.log(err.message)
        }
    }

}
