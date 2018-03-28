window.onload = function(){
  console.log("site loaded")
  getPosts(buildPosts)
}

function buildPosts(posts){
  const div = document.getElementById('posts')
  for (i in posts) {
    let post = posts[i]
    let template = postTemplate
    let newDiv = document.createElement('div')
    template = template.replace('{title}', post.title)
    template = template.replace('{body}', post.body)
    template = template.replace('{date}', post.date)
    template = template.replace('{location}', post.location)
    newDiv.innerHTML=template
    div.appendChild(newDiv)
  }
}


const postPost = () => {
  const post = {
    title: "test",
    body: "hej hej",
  }
  getLocatioBeforePosting().then(position => {
    post.position = position
    console.log(post)
    bloggPost(post)
  })
}

function getLocatioBeforePosting(){
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
      return resolve(position)
    });
  })
}

function bloggPost(post){
  var http = new XMLHttpRequest();

  var method = "POST";
  var url = "/posts"

  http.open(method, url, true);
  http.setRequestHeader("Content-type","application/json");
  http.send(JSON.stringify(survey));
  http.onload = function() {
    if (http.status === 201) {
      alert("Survey was added!")
      location.reload()
    }else {
      alert("something went wrong, try again later")
    }
  }
}

function getPosts(callback){

  var http = new XMLHttpRequest();
  var method = "GET";
  var url = "/posts"
  http.open(method, url, true);
  http.setRequestHeader("Content-type","application/json");
  http.send();
  http.onload = function() {
    if (http.status === 200) {
      callback(JSON.parse(http.response).posts)
    }else {
      alert("something went wrong, try again later")
    }
  }
}

// Not proud of this but it gets the job done and without much hassle
const postTemplate = '<div class="row"><div class="col"><div class="post-wrapper"><div class="row"><div class="col"><div class="post-title"><h3>{title}</h3></div></div></div><div class="row"><div class="col"><div class="post-body"><p>{body}</p></div></div></div><div class="row"><div class="col"><div class="post-location"><p>{location}</p></div></div><div class="col"><div class="post-date"><p>{date}</p></div></div></div></div></div></div>'
