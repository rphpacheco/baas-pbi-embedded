const getTokenApp = async event => {
  const adal = require("adal-node")
  const AuthenticationContext = adal.AuthenticationContext

  const { getAccessToken } = require('./src/services/AcquireTokenServices')

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

const refreshTokenApp = async event => {
  const adal = require("adal-node")
  const AuthenticationContext = adal.AuthenticationContext

  const { refreshAccessToken } = require('./src/services/AcquireTokenServices')

  const { refresh_token, client_id, resource } = JSON.parse(event.body)

  const context = new AuthenticationContext(process.env.AUTHORITY_URL)

  const config = {
    refreshToken: refresh_token, 
    clientId: client_id, 
    resource
  }

  const token = await refreshAccessToken(context, config)

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
  refreshTokenApp,
  getGroups,
  getReports
}