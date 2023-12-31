import { Actions } from "../components/store/reducer";
import { FAKE_TEMPLATES, FAKE_WALLS } from "../utils/Constant";

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

export const getDecoders = async (store) => {
  const apiPath = `/device/decoders`;
  // return await apiGET({
  //   apiPath,
  //   store,
  // });
  const result = [
    {
      "nickName": "1DD",
      "mac": "0:1c:d5:1:11:cb",
      "model": "ZyperUHD60",
      "type": "decoder",
      "virtualType": "none",
      "name": "1D",
      "state": "Up",
      "productCode": "ZUHDDEC60",
      "productDescription": "Copper Decoder - HDMI 2.0",
      "pid": "0x0",
      "groupId": "",
      "groupName": ""
    },
    {
      "nickName": "",
      "mac": "0:1c:d5:1:11:e4",
      "model": "ZyperUHD60",
      "type": "decoder",
      "virtualType": "none",
      "name": "3D",
      "state": "Down",
      "productCode": "ZUHDDEC60",
      "productDescription": "Copper Decoder - HDMI 2.0",
      "pid": "0x0",
      "groupId": "",
      "groupName": ""
    },
    {
      "nickName": "",
      "mac": "0:1c:d5:1:11:f0",
      "model": "ZyperUHD60",
      "type": "decoder",
      "virtualType": "none",
      "name": "2D",
      "state": "Up",
      "productCode": "ZUHDDEC60",
      "productDescription": "Copper Decoder - HDMI 2.0",
      "pid": "0x0",
      "groupId": "",
      "groupName": ""
    },
    {
      "nickName": "",
      "mac": "0:1c:d5:1:13:e2",
      "model": "ZyperUHD60",
      "type": "decoder",
      "virtualType": "none",
      "name": "4D",
      "state": "Down",
      "productCode": "ZUHDDEC60A",
      "productDescription": "Copper Decoder - HDMI 2.0 Dante",
      "pid": "0x0",
      "groupId": "",
      "groupName": ""
    }
  ]
  return result;
};

export const getEncoders = async (store) => {
  const apiPath = `/device/encoders`;
  // return await apiGET({
  //   apiPath,
  //   store,
  // });
  const result = [
    {
      "nickName": "",
      "mac": "0:1c:d5:1:2d:dc",
      "model": "ZyperUHD60",
      "type": "encoder",
      "virtualType": "none",
      "name": "1E",
      "state": "Up",
      "productCode": "ZUHDENC60V2",
      "productDescription": "Copper Encoder - HDMI 2.0",
      "pid": "0x0",
      "groupId": "",
      "groupName": "",
      "previewUrl": "http://192.168.0.70:8080/?action=stream&w=1280&h=720&fps=15&bw=5000&as=0"
    },
    {
      "nickName": "",
      "mac": "0:1c:d5:1:2f:7e",
      "model": "ZyperUHD60",
      "type": "encoder",
      "virtualType": "none",
      "name": "EN1-PC1",
      "state": "Down",
      "productCode": "ZUHDENC60V2",
      "productDescription": "Copper Encoder - HDMI 2.0",
      "pid": "0x0",
      "groupId": "",
      "groupName": "",
      "previewUrl": "http://172.16.1.11:8080/?action=stream&w=1280&h=720&fps=15&bw=5000&as=0"
    },
    {
      "nickName": "2EE",
      "mac": "0:1c:d5:1:2f:89",
      "model": "ZyperUHD60",
      "type": "encoder",
      "virtualType": "none",
      "name": "2E",
      "state": "Down",
      "productCode": "ZUHDENC60V2",
      "productDescription": "Copper Encoder - HDMI 2.0",
      "pid": "0x0",
      "groupId": "",
      "groupName": "",
      "previewUrl": "http://192.168.0.71:8080/?action=stream&w=1280&h=720&fps=15&bw=5000&as=0"
    }
  ]
  return result;
};

// Template ========================================================

export const getTemplates = async (store) => {
  const apiPath = `/templates`;
  // return await apiGET({
  //   apiPath,
  //   store,
  // });
  const result = FAKE_TEMPLATES;
  return result;
};

export const createTemplate = async (store) => {
  const apiPath = `/template`;
  // return await apiGET({
  //   apiPath,
  //   store,
  // });
  const result = true;
  return result;
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

// Wall ========================================================

export const getWalls = async (store) => {
  const apiPath = `/walls`;
  // return await apiGET({
  //   apiPath,
  //   store,
  // });
  const result = FAKE_WALLS;
  return result;
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

export const wallVideoAssociate = async (store) => {
  return true;
};
