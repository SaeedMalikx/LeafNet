const initialState = {
  isloggedin: false,
  markerlist: []
};


const user = (state = initialState, action) => {
  switch(action.type) {
    case "SET_ISLOGGEDIN":
      return Object.assign({}, state, {
        isloggedin: action.payload,
      })
    case "SET_MARKERS": 
      return Object.assign({}, state, {
        markerlist: action.payload,
      })
    case "CLEAR_MARKERS": 
      return Object.assign({}, state, {
        markerlist: [],
      })
    default:
      return state;
  }
};

export default user
