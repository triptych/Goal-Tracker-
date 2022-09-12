const start = () => {
  //const user = await getUserInfo() 
  //console.log('user', user)
  //document.querySelector('#username').innerHTML=user.name
  console.log('init called')
  getUserInfo().then((resp) => {
    document.querySelector('#username').innerHTML = resp.name
  });

}

const bindings = () => {
  console.log('bindings called')
  // document.querySelector('#logout').addEventListener('click', (e) => {
  // fetch('/logout', { method: 'POST', credentials: 'same-origin' })

  // fetch('logout', {
  //   method: 'get',
  //   credentials: 'include', // <--- YOU NEED THIS LINE
  //   redirect: "follow"
  // }).then(res => {
  //   console.log(res);
  // }).catch(err => {
  //   console.log(err);
  // });

  //window.location.href = "/logout"
  // cookieStore.get('REPL_AUTH').then((resp)=>{
  //   console.log('cookie:', resp)
  // })

  //})

  document.querySelector("#update").addEventListener("click", ()=>{
    putData({foo:'3'});
  })
}

const fetchData = async () => {
  let data = await fetch("/data").then((resp)=>{
    if (resp.ok) {
      return resp.json()
    }
  })
  console.log('data', data)

}

const putData = async (data) => {
  const rawResponse = await fetch('/set', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({a: 1, b: 'Textual content'})
  });
  const content = await rawResponse.json();

  console.log(content);
}


window.addEventListener("DOMContentLoaded", () => {
  console.log('dom loaded')
  start();
  bindings();
  fetchData();
})