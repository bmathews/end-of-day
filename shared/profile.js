var Q = require('q');
var debug = require('debug')('mailer');
var google = require('googleapis');
var oauth = google.oauth2('v2');
var fetch = require('node-fetch');
var { stringify } = require('querystring');

export default class Profile {

  /*
   * Store the auth client to use with api calls
   */

  setAuth (oauth) {
    this.oauth = oauth;
  }


  /*
   * Use the oauth api to grab the current userinfo
   */

  getProfile () {
    return Q.nfcall(oauth.userinfo.v2.me.get, {
      auth: this.oauth.client
    }).then((res) => {
      var profile = res[0];
      return profile;
    });
  }

  getContacts () {
    console.log(this.oauth.client)
    var queryParams = stringify({
      access_token: this.oauth.client.credentials.access_token,
      domain: "wintr.us",
      viewType: "domain_public"
    });
    return fetch(`https://www.googleapis.com/admin/directory/v1/users?${queryParams}`)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        return data.users.map((c) => {
          return {
            name: c.name.fullName,
            address: c.emails.filter(e => e.primary)[0].address
          };
        });
      });
  }
}
