const getAccessToken = async(context, config) => 
    new Promise(
      (resolve, reject) => {
          context.acquireTokenWithUsernamePassword(config.scope, config.username, config.password, config.client_id, function (err, tokenResponse) {

              // Function returns error object in tokenResponse
              // Invalid Username will return empty tokenResponse, thus err is used
              if (err) {
                  reject(tokenResponse == null ? err : tokenResponse);
              }
              resolve(tokenResponse);
          })
      }
    )

const refreshAccessToken = async (context, config) =>
    new Promise(
        (resolve, reject) => {
            context.acquireTokenWithRefreshToken(config.refreshToken, config.clientId, config.resource, function (err, tokenResponse) {
                // Function returns error object in tokenResponse
                // Invalid Username will return empty tokenResponse, thus err is used
                if (err) {
                    reject(tokenResponse == null ? err : tokenResponse);
                }
                resolve(tokenResponse);
            })
        }
    )

module.exports = { getAccessToken, refreshAccessToken }