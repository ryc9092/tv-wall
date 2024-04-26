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

// Other API Method

const apiCall = async ({
  httpMethod,
  apiPath,
  params,
  form,
  store: { vars },
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

export const editDevice = async (
  store,
  macAddr,
  nickName,
  audioAnalog,
  audioHdmi,
  ip,
  model,
  type
) => {
  const httpMethod = `PATCH`;
  const apiPath = `/devices/${macAddr}`;
  const form = JSON.stringify({
    nickName: nickName,
    audioAnalogy: audioAnalog,
    audioHdmi: audioHdmi,
    additionalDeviceIp: ip,
    model: model,
    type: type,
  });
  return await apiCall({
    httpMethod,
    apiPath,
    form,
    store,
  });
};

export const createDeviceLink = async ({
  store,
  id,
  linkType,
  encoder,
  remark,
  decoders,
  value1,
  isPreset,
}) => {
  const apiPath = `/devicelinks`;
  const form = JSON.stringify({
    id: id,
    linkType: linkType,
    encoder: encoder,
    remark: remark,
    deviceLinkDetails: decoders,
    value1: value1,
    isPreset: isPreset,
  });
  return await apiPOST({
    apiPath,
    form,
    store,
  });
};

export const removeDeviceLink = async ({ store, linkId }) => {
  const httpMethod = "DELETE";
  const apiPath = `/devicelinks/${linkId}`;
  return await apiCall({
    httpMethod,
    apiPath,
    store,
  });
};

export const getDeviceLinkByEncoder = async ({ store, linkId }) => {
  const apiPath = `/deviceLinkDetails/linkId/${linkId}`;
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

export const setDefaultTemplate = async (store, templateId, col, row) => {
  const httpMethod = "PATCH";
  const apiPath = `/tvwalls/templates/setDefault/${templateId}`;
  const form = JSON.stringify({
    col: col,
    row: row,
  });
  return await apiCall({
    httpMethod,
    apiPath,
    form,
    store,
  });
};

export const deleteTemplate = async (store, templateId) => {
  const httpMethod = `DELETE`;
  const params = `templateId=${templateId}`;
  const apiPath = `/tvwalls/templates`;
  return await apiCall({
    httpMethod,
    apiPath,
    params,
    store,
  });
};

export const getTemplateScreensById = async (store, templateId) => {
  const params = `templateId=${templateId}`;
  const apiPath = `/tvwalls/templates/Screens/query`;
  return await apiGET({
    apiPath,
    params,
    store,
  });
};

// Wall ========================================================

export const getWalls = async (store) => {
  const apiPath = `/tvwalls`;
  return await apiGET({
    apiPath,
    store,
  });
};

export const deleteWall = async (id, store) => {
  const httpMethod = "DELETE";
  const apiPath = `/tvwalls/${id}`;
  return await apiCall({
    httpMethod,
    apiPath,
    store,
  });
};

export const createWall = async (
  store,
  wallId,
  wallName,
  col,
  row,
  screens
) => {
  const apiPath = `/tvwalls`;
  const form = JSON.stringify({
    wallId: wallId,
    wallName: wallName,
    col: col,
    row: row,
    screens: screens,
  });
  return await apiPOST({
    apiPath,
    form,
    store,
  });
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

export const activeWall = async ({
  store,
  activeId,
  wallId,
  wallType,
  templateId,
  blocks,
  isPreset,
}) => {
  const apiPath = `/tvwalls/active`;
  const form = JSON.stringify({
    actvieId: activeId,
    wallId: wallId,
    templateId: templateId,
    wallType: wallType,
    blocks: blocks,
    isPreset: isPreset,
  });
  return await apiPOST({
    apiPath,
    form,
    store,
  });
};

export const deactiveWall = async ({ store, activeId }) => {
  const httpMethod = "DELETE";
  const apiPath = `/tvwalls/active/${activeId}`;
  return await apiCall({
    httpMethod,
    apiPath,
    store,
  });
};

export const getActivedWall = async ({ store, activeId }) => {
  const apiPath = `/tvwalls/active/${activeId}`;
  return await apiGET({
    apiPath,
    store,
  });
};

// Situation

export const createSituation = async ({ id, name, description, store }) => {
  const apiPath = `/presets`;
  const form = JSON.stringify({
    id: id,
    name: name,
    remark: description,
    preSetPostDetails: [],
  });
  return await apiPOST({
    apiPath,
    form,
    store,
  });
};

export const getSituations = async (store) => {
  const apiPath = `/presets`;
  return await apiGET({
    apiPath,
    store,
  });
};

export const activateSituation = async (id, store) => {
  const apiPath = `/presets/active/${id}`;
  await new Promise((t) => setTimeout(t, 500));
  return await apiPOST({
    apiPath,
    store,
  });
};

export const removeSituation = async (id, store) => {
  const httpMethod = "DELETE";
  const apiPath = `/presets/${id}`;
  return await apiCall({
    httpMethod,
    apiPath,
    store,
  });
};

export const removeSituationDetail = async (id, store) => {
  const httpMethod = "DELETE";
  const apiPath = `/presets/details/${id}`;
  return await apiCall({
    httpMethod,
    apiPath,
    store,
  });
};

export const getSituationDetails = async (store, id) => {
  const apiPath = `/presets/${id}/details`;
  return await apiGET({
    apiPath,
    store,
  });
};

export const setSituationDetailsOrder = async (store, orderedDetails) => {
  const httpMethod = "PATCH";
  const apiPath = `/presets/details/setorder`;
  const form = JSON.stringify({
    detailsOrder: orderedDetails,
  });
  return await apiCall({
    httpMethod,
    apiPath,
    form,
    store,
  });
};

export const presetDeviceLink = async ({
  store,
  presetDetailId,
  linkType,
  encoder,
  remark,
  decoders,
  presetPostDetail,
}) => {
  const apiPath = `/devicelinks/preset`;
  const form = JSON.stringify({
    id: presetDetailId,
    linkType: linkType,
    encoder: encoder,
    remark: remark,
    deviceLinkDetails: decoders,
    presetPostDetail: presetPostDetail,
  });
  return await apiPOST({
    apiPath,
    form,
    store,
  });
};

export const presetWall = async ({
  store,
  activeId,
  wallId,
  templateId,
  blocks,
  presetPostDetail,
}) => {
  const apiPath = `/tvwalls/preset`;
  const form = JSON.stringify({
    actvieId: activeId,
    wallId: wallId,
    templateId: templateId,
    blocks: blocks,
    presetPostDetail: presetPostDetail,
  });
  return await apiPOST({
    apiPath,
    form,
    store,
  });
};
