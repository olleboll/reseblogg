import React, { Component } from 'react';

class Post extends Component {
  render() {
    return (
      <div className="blogg-post">
        <div className="post-title row">
          <h1>{this.props.title}</h1>
        </div>
        <div className="post-body row">
          <p>{this.props.body}</p>
        </div>
      </div>
    );
  }
}

export default Post;
