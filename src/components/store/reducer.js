import { clearState } from "./store";

const Actions = {
  SetVars: "SetVars",
  SetAccount: "SetAccount",
  SetSiderCollapse: "SetSiderCollapse",
  Logout: "Logout",
};

const setValueActions = {
  [Actions.SetVars]: "vars",
  [Actions.SetAccount]: "account",
  [Actions.SetSiderCollapse]: "siderCollapse",
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
    if (action.type === Actions.Logout) {
      sessionStorage.clear();
      return {
        ...state,
        ...clearState,
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
