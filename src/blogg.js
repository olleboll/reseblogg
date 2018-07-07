import React, { Component } from 'react';
import Post from './post'

class Blogg extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }
  
  componentDidMount(){
    console.log("mounting")
    fetch('/api/posts').then( (res) => res.json() ).then( data => {
      console.log(posts)
      const { posts } = data
      this.setState({posts})
    })
  }
  
  render() {
    console.log(this.state)
    const posts = (this.state.posts === undefined) ? '' : this.state.posts.map( (post, i) => {
      console.log(post)
      console.log(i)
      return (
        <div key={i}>
          <Post title={post.title} body={post.body}/>
        </div>
      )
    })
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="top-image">
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {posts}
          </div>
        </div>
      </div>
    );
  }
}

export default Blogg;
