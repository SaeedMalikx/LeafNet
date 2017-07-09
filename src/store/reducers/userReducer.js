const initialState = {
  isloggedin: false
};


const user = (state = initialState, action) => {
  switch(action.type) {
    case "SET_ISLOGGEDIN":
      return Object.assign({}, state, {
        isloggedin: action.payload,
        
      })
    default:
      return state;
  }
};

export default user