import React from 'react';
import Icon from './icon.js';

export default React.createClass({

  _getProfileName () {
    if (this.props.profile) {
      return <span>{this.props.profile.email}</span>
    }
  },

  render() {
    return (
      <div className="toolbar">
        <svg style={{width: '78px', float: 'left', marginTop: '3px'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 327.023 612 137.953" enable-background="new 0 327.023 612 137.953"><path d="M86.305 402.966l-28.542 61.332L0 332.288h23.445l36.02 83.758 14.1-30.24L49.1 332.288h20.05l17.16 40.094 17.16-40.095h20.047l-24.464 53.515 14.1 30.24 36.012-83.756h23.445l-57.763 132.008-28.542-61.332zm108.41-70.676h22.936v127.418h-22.934v-127.42zm151.38 0h20.39v132.686l-84.098-79.172-10.363-11.212v85.118h-20.388V327.023l81.72 76.792 12.742 13.42v-84.947h-.002zm45.885 0h86.647v18.007h-33.13v109.41H425.11v-109.41h-33.13V332.29zM612 459.71h-27.18l-50.12-73.9h15.46c16.648 0 25.314-6.796 25.314-18.008 0-11.893-8.835-17.5-25.313-17.5h-22.934v109.412H504.12V332.29h52.666c26.843 0 41.963 11.892 41.963 35.506 0 15.46-9.006 26.163-30.41 30.24L612 459.712z" fill="#fff"/></svg>
        <span style={{float: 'right'}}>
          {this._getProfileName()}
          <Icon icon="more-vert"/>
        </span>
      </div>
    );
  }
});
