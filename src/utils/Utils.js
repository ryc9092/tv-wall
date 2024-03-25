import { notification } from "antd";
import { ExclamationCircleFilled, InfoCircleFilled } from "@ant-design/icons";

export const showWarningNotification = (warningMsg) => {
  notification.info({
    message: warningMsg,
    icon: <ExclamationCircleFilled style={{ color: "#D12727" }} />,
    placement: "bottom",
    style: {
      width: "500px",
      fontSize: "16px",
      borderRadius: "16px",
      border: "1px solid #D12727",
      backgroundColor: "rgb(250, 232, 232)",
    },
  });
};

export const showSuccessNotificationByMsg = (successMsg) => {
  notification.info({
    message: successMsg,
    icon: <InfoCircleFilled style={{ color: "green" }} />,
    placement: "bottom",
    style: {
      width: "500px",
      fontSize: "16px",
      borderRadius: "16px",
      border: "1px solid #3A84A7",
      backgroundColor: "rgb(234, 242, 245)",
    },
  });
};

export const uuid = () => {
  var d = Date.now();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};
