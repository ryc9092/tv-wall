const Actions = {
  SetVars: "SetVars",
  SetAccount: "SetAccount",
};

const setValueActions = {
  [Actions.SetVars]: "vars",
  [Actions.SetAccount]: "account",
};

const Reducer = (state, action) => {
  if (Actions[action.type]) {
    // Process simple set-value Actions
    if (action.type in setValueActions) {
      return {
        ...state,
        [setValueActions[action.type]]: action.payload,
      };
    }
    throw new Error(`action type not handled: ${action.type}`);
  } else {
    console.log(`unknown action type: ${action.type}`);
  }
  // Other custom Action logic can go here.
  return state;
};
export { Actions };
export default Reducer;
