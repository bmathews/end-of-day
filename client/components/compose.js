import React from 'react';
import Editor from './editor.js'

var ReactTags = require('react-tag-input').WithContext;
var _ = require('lodash');

export default React.createClass({

  propTypes: {
    onSend: React.PropTypes.func.isRequired,
    profile: React.PropTypes.object.isRequired,
    contacts: React.PropTypes.array.isRequired,
  },

  getDefaultProps() {
    return {
      html: ""
    };
  },

  getInitialState () {
    return {
      tags: [],
      suggestions: []
    }
  },

  componentWillMount () {
    this._setSuggestions(this.props.contacts);
  },

  componentWillReceiveProps (nextProps) {
    this._setSuggestions(nextProps.contacts);
  },


  /*
   * Set the suggestions based on the contacts propa
   */

  _setSuggestions (contacts) {
    this.setState({
      suggestions: contacts.map(c => c.address)
    });
  },


  /*
   * Handle deleting of a tag
   */

  _handleDelete (i) {
    var tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({tags: tags});
  },


  /*
   * Handle adding of a tag
   */

  _handleAddition (tag) {
    if (!this._canAddTag(tag)) { return false }

    var tags = this.state.tags;
    var suggestions = this.state.suggestions;

    tags.push({
        id: tag,
        text: tag
    });

    this.setState({tags: tags});
  },


  /*
   * If it's not already added or if it is in the suggestions
   */

  _canAddTag (tag) {
    return _.contains(this.state.suggestions, tag) && !_.find(this.state.tags, _.matchesProperty('text',tag))
  },


  /*
   * Call props.onSend with message when the button is click
   */
  _handleSendClick () {
    var tags = this.state.tags;
    var msg = {
      from: this.props.profile.name + "<" + this.props.profile.email + ">",
      to: this.state.tags.map(t => t.text).join(', '),
      subject: "EOD",
      body: this.state.content
    };

    this.props.onSend(msg);
  },


  /*
   * Update internal state whenever the editor's content changes
   */
  _handleEditorChange (content) {
    this.setState({content: content})
  },


  /*
   * Render
   */

  render() {
    return (
      <div className="flex-column flex-1 compose">
        <div className="recipients">
          <span className="label">To </span>
          <ReactTags tags={this.state.tags}
                    placeholder=""
                    suggestions={this.state.suggestions}
                    handleDelete={this._handleDelete}
                    handleAddition={this._handleAddition} />
        </div>
        <div className="content flex-1 flex-column">
          <Editor onChange={this._handleEditorChange} html={this.state.content} />
          <div>
            <button onClick={this._handleSendClick}>Send</button>
          </div>
        </div>
      </div>
    );
  }
});
