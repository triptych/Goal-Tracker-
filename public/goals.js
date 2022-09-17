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


  document.querySelector("#update").addEventListener("click", () => {
    const gl = document.querySelector('#goals-list');
    gl.classList.add('loading');
    putData();
    render();
  });

  document.querySelector("#add-goal").addEventListener('click', () => {
    createGoal();
  });

  document.querySelector("#goal-update").addEventListener('click', () => {
    addGoal();
    render()
  });

  document.querySelector("#goals-list").addEventListener('click', (e) => {
    // if (e.target.nodeName === 'LI') {
    //   let goalId = e.target.getAttribute('data-id');
    //   console.log(goalId)
    // }
    if (e.target.nodeName === 'A' && e.target.classList.contains('goal-update')) {
      let goalId = e.target.closest('li').getAttribute('data-id');
      console.log(goalId)
      editProgress(goalId);
      setStatus('unsaved -el updated')
    }
    if (e.target.nodeName === 'A' && e.target.classList.contains('goal-delete')) {
      let goalId = e.target.closest('li').getAttribute('data-id');
      deleteGoal(goalId);
      render();
      setStatus('unsaved - el deleted')
    }

    //updateGoal();
    //render()
    //console.log('update called')

  });

  // document.querySelector(".goal-delete").addEventListener('click', (e) => {
  //   let goalId = e.target.closest('li').getAttribute('data-id');
  //   deleteGoal(goalId);
  //   render()

  // });

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
    gl.classList.remove('loading');
    let glDOM = ``;
    state.goals.forEach((itm, idx, arr) => {
      glDOM = `${glDOM} 
       <li data-id='${itm.id}' class="goals-list-item">
         [${itm.name}] 
         - (${itm.state})
         - <span class="goals-list-percent"> ${itm.percent}%</span>
         <progress max=100 value="${itm.percent}" class="goals-list-progress"></progress>
         - <a href="#" class="goal-update" >update</a>
         - <a href="#" class="goal-delete">x</a>
    
         
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

const deleteGoal = (goalId) => {
  const targetGoalId = state.goals.forEach((itm, idx, arr) => {
    if (parseInt(itm.id) === parseInt(goalId)) {
      state.goals.splice(idx, 1);
    }
  })
  render()
}
const addGoal = () => {
  if (state) {
    if (!state.goals) {
      state.goals = [];
    }
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
  setStatus('unsaved - goal added')
}

const editProgress = (idx, val) => {
  //state.goals[idx].percent = val;
  //render();
  console.log("editProgress called with idx: ", idx, " val: ", val)
  // get right goal
  const goal = document.querySelector('#goals-list li[data-id="' + idx + '"]');
  goal.querySelector('.goals-list-progress').outerHTML = `<input type="range" min="0" max="100" value="${val}" oninput="updateGoalProgress(this)" />`;
  // `< progress max = 100 value = "${val}" class="goals-list-progress" ></progress > `;
}

const updateGoalProgress = (el) => {
  console.log("updateGoalProgress called with e: ", el);
  let goalProgressEl = el.closest('.goals-list-item')
  goalProgressEl.querySelector('.goals-list-percent').innerHTML = el.value + "%";

  // update goal state
  let goalId = goalProgressEl.getAttribute('data-id');
  let goal = null;
  state.goals.forEach((itm, idx, arr) => {
    console.log(itm.id, goalId);
    if (parseInt(itm.id) === parseInt(goalId)) {
      console.log("found goal with id: ", itm.id);
      goal = itm;
    }
  })
  console.log("goal:", goal)
  goal.percent = el.value;
  console.log("goal.percent: ", goal.percent);

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
  setStatus('saved.' + content.name);
}

const setStatus = (status) => {
  document.querySelector('.status').innerHTML = status;
}

window.addEventListener("DOMContentLoaded", () => {
  console.log('dom loaded')
  start();
  bindings();
  fetchData().then((data) => {
    console.log('fetchData resolved with data:', data);
    setStatus('loaded')
    render();
  });
});
