import { Actions } from "../components/store/reducer";

// Login API ========================================================

export const loginAPI = async (userName, password) => {
  return "JWT";
};

export const login = async ({ username, password, store }) => {
  const apiPath = "/auth/login";
  const body = JSON.stringify({
    uId: username,
    pwd: password,
  });
  try {
    const API_BASE = `https://${store.vars.ApiServer.Hostname}:${store.vars.ApiServer.Port}`;
    const response = await fetch(`${API_BASE}${apiPath}`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: body,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

// Get ========================================================

const apiGET = async ({
  apiPath,
  params,
  store: { vars },
  dispatch,
  setError,
}) => {
  if (setError) setError(null);
  let result;
  const API_BASE = `https://${vars.ApiServer.Hostname}:${vars.ApiServer.Port}`;

  const paramsUri = params === undefined ? "" : `?${params}`;
  const jwt = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE}${apiPath}${paramsUri}`, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  try {
    const json = await response.json();
    if (json.code !== 0) throw new Error(json.msg);
    result = json.data;
    return result;
  } catch (error) {
    if (response.status === 401)
      dispatch({ type: Actions.Logout, payload: null });
    if (setError) setError(error.message);
  }
};

// POST ========================================================

const apiPOST = async ({
  apiPath,
  params,
  form,
  store: { vars },
  httpMethod = "POST",
  dispatch,
  setError,
}) => {
  if (setError) setError(null);
  let result;
  // format parameters
  const postParams = new URLSearchParams();
  if (form !== undefined && form) {
    for (const [key, value] of Object.entries(form)) {
      postParams.append(key, value);
    }
  }

  const contentType = form
    ? "application/json"
    : "application/x-www-form-urlencoded; charset=UTF-8";
  const API_BASE = `https://${vars.SCStation.Hostname}:${vars.SCStation.Port}`;
  const paramsUri = params === undefined ? "" : `?${params}`;
  const jwt = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE}${apiPath}${paramsUri}`, {
    method: httpMethod,
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": `${contentType}`,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: form ? form : postParams,
  });
  try {
    const json = await response.json();
    if (json.code !== 0) throw new Error(json.code);
    result = json.data;
    return result ? result : true;
  } catch (error) {
    if (response.status === 401)
      dispatch({ type: Actions.Logout, payload: null });
    if (setError) setError(error.message);
  }
};

// Device ========================================================

export const getDecoders = () => {

}

export const getEncoders = () => {

}