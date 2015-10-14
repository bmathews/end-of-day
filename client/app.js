var ipc = require('ipc');
var React = require('react/addons');

var secrets = require('../secrets.json');
var debug = require('debug')('app');

var Icon = require('./components/icon');
var Toolbar = require('./components/toolbar');
var Compose = require('./components/compose');

var OAuth2 = require('../shared/OAuth2');
var auth = new OAuth2(secrets.oauth);

var mailer = new (require('../shared/mailer'))();
var profile = new (require('../shared/profile'))();
mailer.setAuth(auth);
profile.setAuth(auth);

var google = require('googleapis');
var Q = require('q');

var Configstore = require('configstore');
var conf = new Configstore('eod');

conf.clear();


export default React.createClass({

  getInitialState () {
    return { }
  },

  componentDidMount () {
    ipc.on('auth.change', this._authChange);
    ipc.send('auth.get');
  },

  componentWillUnmount () {
    ipc.off('auth.change', this._authChange);
  },


  /*
   * Update our auth client whenever we get new access tokens
   */

  _authChange (err, token) {
    if (!err) {
      auth.client.setCredentials(token);
      this._getProfile();
      this._getContacts();
    } else {
      console.error("auth.change error:" + err);
    }
  },


  /*
   * Get the user's profile information
   */

  async _getProfile () {
    try {
      var p = await profile.getProfile();
      this.setState({ profile: p });
    } catch (e) {
      console.error(e);
    }
  },


  /*
   * Get the user's contacts
   */

  async _getContacts () {
    try {
      var contacts = await profile.getContacts();
      console.log(contacts)
      this.setState({ contacts: contacts });
    } catch (e) {
      console.error(e);
    }
  },


  /*
   * Send the message
   */

  async _handleSend (msg) {
    try {
      await mailer.send(msg);
    } catch (e) {
      console.error(e);
    }
  },


  /*
   * Render the tools based on whether we have the contacts/profile yet.
   */

  _renderTools () {
    if (this.state.profile && this.state.contacts) {
      return ([
        <Toolbar key="toolbar" profile={this.state.profile}/>,
        <Compose key="compose" profile={this.state.profile} contacts={this.state.contacts} onSend={this._handleSend}/>
      ]);
    } else {
      return (
        <div style={{display: 'flex', flex: '1', alignItems: 'center', justifyContent: 'center'}}><span>Authenticating...</span></div>
      );
    }
  },


  /*
   * Render
   */

  render () {
    return (
      <div className="flex-column">
        {this._renderTools()}
      </div>
    );
  }
});
