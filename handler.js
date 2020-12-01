const getTokenApp = async event => {
  const adal = require("adal-node")
  const AuthenticationContext = adal.AuthenticationContext

  const { getAccessToken } = require('./src/services/getTokenApp')

  const { client_id, username, password } = JSON.parse(event.body)

  const context = new AuthenticationContext(process.env.AUTHORITY_URL)

  const config = {
    scope: process.env.SCOPE_URL, 
    username, 
    password, 
    client_id
  }

  const token = await getAccessToken(context, config)

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify(token),
  };
};

const getGroups = async event => {
  const axios = require('axios')
  const { token } = JSON.parse(event.body)
  
  try {
    const request = await axios.get(process.env.BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify(request.data),
    }
  } catch (error) {
    return {
      statusCode: getStatusCode(error.message),
      body: JSON.stringify(error.message),
    }
  }
}

const getReports = async event => {
  const axios = require('axios')
  const { token, group_id } = JSON.parse(event.body)

  try {
    const request = await axios.get(`${process.env.BASE_URL}/${group_id}/reports`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify(request.data),
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: getStatusCode(error.message),
      body: JSON.stringify(error.message),
    }
  }
}

const getStatusCode = (msg) => {
  const status = msg.substr(msg.length - 3, msg.length)
  return parseInt(status)
}

module.exports = {
  getTokenApp,
  getGroups,
  getReports
}