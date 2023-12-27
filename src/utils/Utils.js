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
