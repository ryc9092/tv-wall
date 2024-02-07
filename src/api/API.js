import { Actions } from "../components/store/reducer";
import {
  FAKE_TEMPLATES,
  FAKE_TEMPLATE_SCREEN_LIST3,
  FAKE_TEMPLATE_SCREEN_LIST4,
  FAKE_TEMPLATE_SCREEN_LIST5,
  FAKE_WALLS,
  FAKE_WALL_SCREEN_LIST1,
  FAKE_WALL_SCREEN_LIST2,
} from "../utils/Constant";

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
  const API_BASE = `http://${vars.ApiServer.Hostname}:${vars.ApiServer.Port}`;
  const paramsUri = params === undefined ? "" : `?${params}`;
  // const jwt = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE}${apiPath}${paramsUri}`, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
    headers: {
      // Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  try {
    const json = await response.json();
    if (json.code !== 0) throw new Error(json.msg);
    result = json.Data;
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
  const API_BASE = `http://${vars.ApiServer.Hostname}:${vars.ApiServer.Port}`;
  const paramsUri = params === undefined ? "" : `?${params}`;
  // const jwt = sessionStorage.getItem("token");
  const response = await fetch(`${API_BASE}${apiPath}${paramsUri}`, {
    method: httpMethod,
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
    headers: {
      // Authorization: `Bearer ${jwt}`,
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

export const getDecoders = async (store) => {
  const apiPath = `/devices/decoders`;
  return await apiGET({
    apiPath,
    store,
  });
};

export const getEncoders = async (store) => {
  const apiPath = `/devices/encoders`;
  return await apiGET({
    apiPath,
    store,
  });
};

// Template ========================================================

export const getTemplates = async (store) => {
  const apiPath = `/tvwalls/templates`;
  return await apiGET({
    apiPath,
    store,
  });
};

export const createTemplate = async (
  store,
  templateId,
  templateName,
  col,
  row,
  isDefault,
  screens
) => {
  const apiPath = `/tvwalls/templates`;
  const form = JSON.stringify({
    templateId: templateId,
    templateName: templateName,
    col: col,
    row: row,
    isDefault: isDefault,
    screens: screens,
  });
  return await apiPOST({
    apiPath,
    form,
    store,
  });
};

export const deleteTemplate = async (store) => {
  const apiPath = `/template`;
  // return await apiGET({
  //   apiPath,
  //   store,
  // });
  const result = true;
  return result;
};

export const getTemplateScreensById = async (store, id) => {
  const apiPath = `/template`;
  // return await apiGET({
  //   apiPath,
  //   store,
  // });
  const result = {
    ft1: FAKE_TEMPLATE_SCREEN_LIST5,
    ft2: FAKE_TEMPLATE_SCREEN_LIST3,
    ft3: FAKE_TEMPLATE_SCREEN_LIST4,
  };
  return result[id];
};

// Wall ========================================================

export const getWalls = async (store) => {
  const apiPath = `/tvwalls`;
  return await apiGET({
    apiPath,
    store,
  });
};

export const deleteWall = async (store) => {
  const apiPath = `/wall`;
  // return await apiGET({
  //   apiPath,
  //   store,
  // });
  const result = true;
  return result;
};

export const createWall = async (store) => {
  const apiPath = `/wall`;
  // return await apiGET({
  //   apiPath,
  //   store,
  // });
  const result = true;
  return result;
};

export const getWallScreensById = async (store, id) => {
  const params = `wallId=${id}`;
  const apiPath = `/tvwalls/wallscreens/query`;
  return await apiGET({
    apiPath,
    params,
    store,
  });
};

export const wallVideoAssociate = async (store) => {
  return true;
};
