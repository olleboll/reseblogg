import React, { Component } from 'react';

class Blogg extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }
  
  componentDidMount(){
    console.log("mounging")
    fetch('/api/posts').then( (res) => res.json() ).then( posts => {
      console.log(posts)
      this.setState({posts})
    })
  }
  
  render() {
    return (
      <div className="container">
        <h1>yo</h1>
      </div>
    );
  }
}

export default Blogg;
