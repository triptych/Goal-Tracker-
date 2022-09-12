let state = {};

const start = () => {
  //const user = await getUserInfo() 
  //console.log('user', user)
  //document.querySelector('#username').innerHTML=user.name
  console.log('start called')
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

  document.querySelector("#update").addEventListener("click", () => {
    putData();
  });

  document.querySelector("#add-goal").addEventListener('click', () => {
    createGoal();
  });

  document.querySelector("#goal-update").addEventListener('click', () => {
    updateGoal();
    render()
  });

}

const fetchData = async () => {
  let data = await fetch("/data").then((resp) => {
    if (resp.ok) {
      return resp.json()
    }
  })
  console.log('fetchData successful => data', data)
  state = data;
  return data;
}

const render = () => {
  console.log("render called with state: ", state);
  if (state.goals) {
    console.log("we have goals");
    const gl = document.querySelector('#goals-list')
    let glDOM = ``;
    state.goals.forEach((itm, idx, arr) => {
      glDOM = `${glDOM} 
       <li data-id='${itm.id}'>
         [${itm.name}] 
         - (${itm.state})
         - ${itm.percent}%
        </li>`
    });
    gl.innerHTML = glDOM;
  } else {
    console.log("we have no goals");

  }

}

const createGoal = () => {
  const ge = document.querySelector("#goal-edit");
  ge.classList.remove('hidden');
}

const updateGoal = () => {
  if (state) {
    if (!state.goals) {
      state.goals = []
    }
    if (state.goals) {
      state.goals[state.goals.length] = {
        id: Math.floor(Math.random() * 1000000) + state.goals.length,
        name: document.querySelector('#goal-name').value,
        state: document.querySelector('#goal-state').value,
        percent: document.querySelector('#goal-percent').value
      }
    }
    document.querySelector('#goal-edit').classList.add('hidden')
  }
}

const putData = async (data) => {
  const rawResponse = await fetch('/set', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(state)
  });
  const content = await rawResponse.json();

  console.log(content);
}


window.addEventListener("DOMContentLoaded", () => {
  console.log('dom loaded')
  start();
  bindings();
  fetchData().then((data) => {
    console.log('fetchData resolved with data:', data);
    render();
  });
})