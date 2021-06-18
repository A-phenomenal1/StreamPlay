export const initialState = {
  user: [],
};

const reducer = (state, action) => {
  console.log("action: ", action);
  switch (action.type) {
    case "SET_USER":
      return {
        user: action.user,
      };
    default:
      return state;
  }
};

export default reducer;
