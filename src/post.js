import React, { Component } from 'react';

import moment from 'moment'

class Post extends Component {
  render() {
    console.log("rendering post")
    console.log(this.props)
    const images = this.props.post.images.map( (image, j) => {
      console.log("image")
      console.log(image)
      return (
        <div className="post-image row" key={j}>
          <img src={image}/>
        </div>
      )
    })
    return (
      <div className="blogg-post">
        <div className="post-title row">
          <div className="col-sm-4 col-sm-offset-2">
            <p className="title">{this.props.post.title}</p>
          </div>
          <div className="col-sm-3">
            <p>Av: {this.props.post.from}</p>
          </div>
          <div className="col-sm-3">
            <p>Tid: {moment(this.props.post.timestamp).format('MM/DD HH:mm')}</p>
          </div>
        </div>
        <div className="post-body row">
          <div className="col-sm-6 col-sm-offset-3">
            <p>{this.props.post.body}</p>
          </div>
        </div>
        <div className="images">
          {images}
        </div>
      </div>
    );
  }
}

export default Post;
