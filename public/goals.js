const init = () => {
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
  document.querySelector('#logout').addEventListener('click', (e) => {
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

  })
}



window.addEventListener("DOMContentLoaded", () => {
  init();
  bindings();
})