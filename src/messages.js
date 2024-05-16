import { defineMessages } from "react-intl";

export default defineMessages({
  // Common
  Text_Common_Name: { id: "Text-Common-Name", defaultMessage: "名稱" },
  Text_Common_Block: { id: "Text-Common-Block", defaultMessage: "區塊" },
  Text_Common_Screen: { id: "Text-Common-Screen", defaultMessage: "畫面" },
  Text_Common_Dimension: {
    id: "Text-Common-Dimension",
    defaultMessage: "維度",
  },
  Text_Common_Encoder: {
    id: "Text-Common-Encoder",
    defaultMessage: "編碼器",
  },
  Text_Common_Decoder: {
    id: "Text-Common-Decoder",
    defaultMessage: "解碼器",
  },
  Text_Common_Description: {
    id: "Text-Common-Description",
    defaultMessage: "描述",
  },
  Text_Button_Save: {
    id: "Text-Button-Save",
    defaultMessage: "儲存",
  },
  Text_Button_View: {
    id: "Text-Button-View",
    defaultMessage: "檢視",
  },
  Text_Button_Delete: {
    id: "Text-Button-Delete",
    defaultMessage: "刪除",
  },
  Text_Button_Cancel: {
    id: "Text-Button-Cancel",
    defaultMessage: "取消",
  },
  Text_Button_Operation: {
    id: "Text-Button-Operation",
    defaultMessage: "操作",
  },

  // Login
  Text_Login_Account: {
    id: "Text-Login-Account",
    defaultMessage: "帳號",
  },
  Text_Login_Password: {
    id: "Text-Login-Password",
    defaultMessage: "密碼",
  },
  Text_Login_EnterAccount: {
    id: "Text-Login-EnterAccount",
    defaultMessage: "輸入帳號",
  },
  Text_Login_EnterPassword: {
    id: "Text-Login-EnterPassword",
    defaultMessage: "輸入密碼",
  },
  Text_Login_RequiredAccount: {
    id: "Text-Login-RequiredAccount",
    defaultMessage: "帳號不可空白",
  },
  Text_Login_RequiredPassword: {
    id: "Text-Login-RequiredPassword",
    defaultMessage: "密碼不可空白",
  },
  Text_Login_ButtonLogin: {
    id: "Text-Login-ButtonLogin",
    defaultMessage: "登入",
  },
  Text_Login_FailMsg: {
    id: "Text-Login-FailMsg",
    defaultMessage: "登入失敗",
  },

  // Side bar
  Text_Sidebar_DeviceStatus: {
    id: "Text-Sidebar-DeviceStatus",
    defaultMessage: "設備即時狀態",
  },
  Text_Sidebar_TVWallManagement: {
    id: "Text-Sidebar-TVWallManagement",
    defaultMessage: "電視牆影音管理",
  },
  Text_Sidebar_SingleScreenManagement: {
    id: "Text-Sidebar-SingleScreenManagement",
    defaultMessage: "單畫面影音管理",
  },
  Text_Sidebar_AudioManagement: {
    id: "Text-Sidebar-AudioManagement",
    defaultMessage: "音頻管理",
  },
  Text_Sidebar_USBManagement: {
    id: "Text-Sidebar-USBManagement",
    defaultMessage: "USB管理",
  },
  Text_Sidebar_RS232Management: {
    id: "Text-Sidebar-RS232Management",
    defaultMessage: "RS232管理",
  },
  Text_Sidebar_ScheduleManagement: {
    id: "Text-Sidebar-ScheduleManagement",
    defaultMessage: "影音排程管理",
  },
  Text_Sidebar_SituationManagement: {
    id: "Text-Sidebar-SituationManagement",
    defaultMessage: "情境管理",
  },
  Text_Sidebar_EventAndAlarm: {
    id: "Text-Sidebar-EventAndAlarm",
    defaultMessage: "事件及告警",
  },
  Text_Sidebar_SystemSetting: {
    id: "Text-Sidebar-SystemSetting",
    defaultMessage: "系統設定",
  },
  Text_Sidebar_Language: {
    id: "Text-Sidebar-Language",
    defaultMessage: "語言",
  },
  Text_Sidebar_Chinese: {
    id: "Text-Sidebar-Chinese",
    defaultMessage: "中文",
  },
  Text_Sidebar_English: {
    id: "Text-Sidebar-English",
    defaultMessage: "英文",
  },
  Text_Sidebar_Logout: {
    id: "Text-Sidebar-Logout",
    defaultMessage: "登出",
  },

  // Device status
  Text_DeviceStatus_CurrentStatus: {
    id: "Text-DeviceStatus-CurrentStatus",
    defaultMessage: "設備即時狀態",
  },
  Text_DeviceStatus_Type: {
    id: "Text-DeviceStatus-Type",
    defaultMessage: "類型",
  },
  Text_DeviceStatus_Alias: {
    id: "Text-DeviceStatus-Alias",
    defaultMessage: "別名",
  },
  Text_DeviceStatus_State: {
    id: "Text-DeviceStatus-State",
    defaultMessage: "狀態",
  },
  Text_DeviceStatus_Detail: {
    id: "Text-DeviceStatus-Detail",
    defaultMessage: "詳細資訊",
  },
  Text_DeviceStatus_Encoder: {
    id: "Text-DeviceStatus-Encoder",
    defaultMessage: "編碼器",
  },
  Text_DeviceStatus_Decoder: {
    id: "Text-DeviceStatus-Decoder",
    defaultMessage: "解碼器",
  },
  Text_DeviceStatus_Content: {
    id: "Text-DeviceStatus-Content",
    defaultMessage: "內容",
  },
  Text_DeviceStatus_Model: {
    id: "Text-DeviceStatus-Model",
    defaultMessage: "模型",
  },
  Text_DeviceStatus_ProductCode: {
    id: "Text-DeviceStatus-ProductCode",
    defaultMessage: "產品編號",
  },
  Text_DeviceStatus_ProductDesc: {
    id: "Text-DeviceStatus-ProductDesc",
    defaultMessage: "產品描述",
  },
  Text_DeviceStatus_Operate: {
    id: "Text-DeviceStatus-Operate",
    defaultMessage: "操作",
  },
  Text_DeviceStatus_Reboot: {
    id: "Text-DeviceStatus-Reboot",
    defaultMessage: "重啟",
  },
  Text_DeviceStatus_RebootSuccess: {
    id: "Text-DeviceStatus-RebootSuccess",
    defaultMessage: "重啟成功",
  },
  Text_DeviceStatus_RebootFail: {
    id: "Text-DeviceStatus-RebootFail",
    defaultMessage: "重啟失敗",
  },

  // TV wall management
  Text_TVWall_TVWallManagement: {
    id: "Text-TVWall-TVWallManagement",
    defaultMessage: "電視牆影音管理",
  },
  Text_TVWall_ActivateWall: {
    id: "Text-TVWall-ActivateWall",
    defaultMessage: "啟用牆面",
  },
  Text_TVWall_DeactivateWall: {
    id: "Text-TVWall-DeactivateWall",
    defaultMessage: "停用牆面",
  },
  Text_TVWall_ClearWallConnection: {
    id: "Text-TVWall-ClearWallConnection",
    defaultMessage: "清除牆面連接",
  },
  Text_TVWall_VideoSource: {
    id: "Text-TVWall-VideoSource",
    defaultMessage: "影像來源",
  },
  Text_TVWall_Preview: {
    id: "Text-TVWall-Preview",
    defaultMessage: "畫面預覽",
  },
  Text_TVWall_ClearBlock: {
    id: "Text-TVWall-ClearBlock",
    defaultMessage: "清除此區塊",
  },
  Text_TVWall_ActiveSuccess: {
    id: "Text-TVWall-ActiveSuccess",
    defaultMessage: "啟用電視牆成功",
  },
  Text_TVWall_ActiveFail: {
    id: "Text-TVWall-ActiveFail",
    defaultMessage: "啟用電視牆失敗, 請確認樣板、編碼器設定無誤",
  },
  Text_TVWall_DeactiveSuccess: {
    id: "Text-TVWall-DeactiveSuccess",
    defaultMessage: "停用電視牆成功",
  },
  Text_TVWall_DeactiveFail: {
    id: "Text-TVWall-DeactiveFail",
    defaultMessage: "停用電視牆失敗",
  },

  // USB management
  Text_USB_USBMgmt: {
    id: "Text-USB-USBMgmt",
    defaultMessage: "USB管理",
  },
  Text_USB_Source: {
    id: "Text-USB-Source",
    defaultMessage: "USB來源",
  },
  Text_USB_ConnectionStatus: {
    id: "Text-USB-ConnectionStatus",
    defaultMessage: "USB連接狀態",
  },
  Text_USB_Connect: {
    id: "Text-USB-Connect",
    defaultMessage: "USB連接",
  },
  Text_USB_CreateConnectionSuccess: {
    id: "Text-USB-CreateConnectionSuccess",
    defaultMessage: "建立USB連結成功",
  },
  Text_USB_CreateConnectionFail: {
    id: "Text-USB-CreateConnectionFail",
    defaultMessage: "建立USB連結失敗",
  },
  Text_USB_TerminalChoose: {
    id: "Text-USB-TerminalChoose",
    defaultMessage: "USB終端選擇",
  },
  Text_USB_ClearConnection: {
    id: "Text-USB-ClearConnection",
    defaultMessage: "清除連結",
  },
  Text_USB_ClearConnectionSuccess: {
    id: "Text-USB-ClearConnectionSuccess",
    defaultMessage: "清除USB連結成功",
  },
  Text_USB_ClearConnectionFail: {
    id: "Text-USB-ClearConnectionFail",
    defaultMessage: "清除USB連結失敗",
  },

  // Audio management
  Text_Audio_AudioMgmt: {
    id: "Text-Audio-AudioMgmt",
    defaultMessage: "Audio管理",
  },
  Text_Audio_Source: {
    id: "Text-Audio-Source",
    defaultMessage: "Audio來源",
  },
  Text_Audio_ConnectionStatus: {
    id: "Text-Audio-ConnectionStatus",
    defaultMessage: "Audio連接狀態",
  },
  Text_Audio_Connect: {
    id: "Text-Audio-Connect",
    defaultMessage: "Audio連接",
  },
  Text_Audio_CreateConnectionSuccess: {
    id: "Text-Audio-CreateConnectionSuccess",
    defaultMessage: "建立audio連結成功",
  },
  Text_Audio_CreateConnectionFail: {
    id: "Text-Audio-CreateConnectionFail",
    defaultMessage: "建立audio連結失敗",
  },
  Text_Audio_AnalogConnect: {
    id: "Text-Audio-AnalogConnect",
    defaultMessage: "Analog連接",
  },
  Text_Audio_HdmiConnect: {
    id: "Text-Audio-HdmiConnect",
    defaultMessage: "Hdmi連接",
  },
  Text_Audio_TerminalChoose: {
    id: "Text-Audio-TerminalChoose",
    defaultMessage: "Audio終端選擇",
  },
  Text_Audio_ClearConnection: {
    id: "Text-Audio-ClearConnection",
    defaultMessage: "清除連結",
  },
  Text_Audio_ClearConnectionSuccess: {
    id: "Text-Audio-ClearConnectionSuccess",
    defaultMessage: "清除audio連結成功",
  },
  Text_Audio_ClearConnectionFail: {
    id: "Text-Audio-ClearConnectionFail",
    defaultMessage: "清除audio連結失敗",
  },

  // Situation
  Text_Situation_Title: {
    id: "Text-Situation-Title",
    defaultMessage: "情境操作",
  },
  Text_Situation_CreateSituation: {
    id: "Text-Situation-CreateSituation",
    defaultMessage: "新增情境",
  },
  Text_Situation_Activate: {
    id: "Text-Situation-Activate",
    defaultMessage: "啟用",
  },
  Text_Situation_CreateSituationSuccess: {
    id: "Text-Situation-CreateSituationSuccess",
    defaultMessage: "新增情境成功",
  },
  Text_Situation_CreateSituationFail: {
    id: "Text-Situation-CreateSituationFail",
    defaultMessage: "新增情境失敗",
  },
  Text_Situation_SituationName: {
    id: "Text-Situation-SituationName",
    defaultMessage: "情境名稱",
  },
  Text_Situation_InputSituationName: {
    id: "Text-Situation-InputSituationName",
    defaultMessage: "請輸入情境名稱",
  },
  Text_Situation_SituationDescription: {
    id: "Text-Situation-SituationDescription",
    defaultMessage: "情境描述",
  },
  Text_Situation_Type: {
    id: "Text-Situation-Type",
    defaultMessage: "類型",
  },
  Text_Situation_Description: {
    id: "Text-Situation-Description",
    defaultMessage: "描述",
  },
  Text_Situation_Operation: {
    id: "Text-Situation-Operation",
    defaultMessage: "操作",
  },
  Text_Situation_AddSituationItem: {
    id: "Text-Situation-AddSituationItem",
    defaultMessage: "新增情境項目",
  },
  Text_Situation_ChooseItem: {
    id: "Text-Situation-ChooseItem",
    defaultMessage: "項目選擇",
  },
  Text_Situation_TVWallManagement: {
    id: "Text-Situation-TVWallManagement",
    defaultMessage: "電視牆影音管理",
  },
  Text_Situation_SingleScreenManagement: {
    id: "Text-Situation-SingleScreenManagement",
    defaultMessage: "單畫面影音管理",
  },
  Text_Situation_AudioManagement: {
    id: "Text-Situation-AudioManagement",
    defaultMessage: "Audio管理",
  },
  Text_Situation_USBManagement: {
    id: "Text-Situation-USBManagement",
    defaultMessage: "USB管理",
  },

  // System setting
  Text_SystemSetting_Title: {
    id: "Text-SystemSetting-Title",
    defaultMessage: "系統設定",
  },

  // System setting - template setting
  Text_TemplateSetting_TemplateSetting: {
    id: "Text-TemplateSetting-TemplateSetting",
    defaultMessage: "電視牆版型設定",
  },
  Text_TemplateSetting_TemplateManagement: {
    id: "Text-TemplateSetting-TemplateManagement",
    defaultMessage: "版型管理",
  },
  Text_TemplateSetting_Default: {
    id: "Text-TemplateSetting-Default",
    defaultMessage: "預設",
  },
  Text_TemplateSetting_DeleteSuccess: {
    id: "Text-TemplateSetting-DeleteSuccess",
    defaultMessage: "版型移除成功",
  },
  Text_TemplateSetting_DeleteFail: {
    id: "Text-TemplateSetting-DeleteFail",
    defaultMessage: "版型移除失敗",
  },
  Text_TemplateSetting_Template: {
    id: "Text-TemplateSetting-Template",
    defaultMessage: "版型",
  },
  Text_TemplateSetting_TemplateName: {
    id: "Text-TemplateSetting-TemplateName",
    defaultMessage: "版型名稱",
  },
  Text_TemplateSetting_CreateTemplate: {
    id: "Text-TemplateSetting-CreateTemplate",
    defaultMessage: "建立新版型",
  },
  Text_TemplateSetting_CreateWallTemplate: {
    id: "Text-TemplateSetting-CreateWallTemplate",
    defaultMessage: "建立電視牆版型",
  },
  Text_TemplateSetting_TemplateId: {
    id: "Text-TemplateSetting-TemplateId",
    defaultMessage: "版型 ID",
  },
  Text_TemplateSetting_ScreenNumber: {
    id: "Text-TemplateSetting-ScreenNumber",
    defaultMessage: "畫面編號",
  },
  Text_TemplateSetting_AddBlock: {
    id: "Text-TemplateSetting-AddBlock",
    defaultMessage: "新增區塊",
  },
  Text_TemplateSetting_ResetTemplate: {
    id: "Text-TemplateSetting-ResetTemplate",
    defaultMessage: "重置版型",
  },
  Text_TemplateSetting_CreateSuccess: {
    id: "Text-TemplateSetting-CreateSuccess",
    defaultMessage: "版型建立成功",
  },
  Text_TemplateSetting_CreateFail: {
    id: "Text-TemplateSetting-CreateFail",
    defaultMessage: "版型建立失敗",
  },

  // System setting - wall setting
  Text_WallSetting_WallSetting: {
    id: "Text-WallSetting-WallSetting",
    defaultMessage: "電視牆設定",
  },
  Text_WallSetting_DeleteSuccess: {
    id: "Text-WallSetting-DeleteSuccess",
    defaultMessage: "電視牆移除成功",
  },
  Text_WallSetting_DeleteFail: {
    id: "Text-WallSetting-DeleteFail",
    defaultMessage: "電視牆移除失敗",
  },
  Text_WallSetting_Wall: {
    id: "Text-WallSetting-Wall",
    defaultMessage: "電視牆",
  },
  Text_WallSetting_WallName: {
    id: "Text-WallSetting-WallName",
    defaultMessage: "電視牆名稱",
  },
  Text_WallSetting_ScreenNumber: {
    id: "Text-WallSetting-ScreenNumber",
    defaultMessage: "畫面編號",
  },
  Text_WallSetting_ScreenDecoderPair: {
    id: "Text-WallSetting-ScreenDecoderPair",
    defaultMessage: "解碼器對應",
  },
  Text_WallSetting_CreateWall: {
    id: "Text-WallSetting-CreateWall",
    defaultMessage: "建立電視牆",
  },
  Text_WallSetting_ResetWall: {
    id: "Text-WallSetting-ResetWall",
    defaultMessage: "重置電視牆",
  },
  Text_WallSetting_CreateSuccess: {
    id: "Text-WallSetting-CreateSuccess",
    defaultMessage: "電視牆建立成功",
  },
  Text_WallSetting_CreateFail: {
    id: "Text-WallSetting-CreateFail",
    defaultMessage: "電視牆建立失敗",
  },

  // System setting - device setting
  Text_DeviceSetting_AdvanceSetting: {
    id: "Text-DeviceSetting-AdvanceSetting",
    defaultMessage: "設備進階設定",
  },
  Text_DeviceSetting_Type: {
    id: "Text-DeviceSetting-Type",
    defaultMessage: "類型",
  },
  Text_DeviceSetting_Alias: {
    id: "Text-DeviceSetting-Alias",
    defaultMessage: "別名",
  },
  Text_DeviceSetting_Operate: {
    id: "Text-DeviceSetting-Operate",
    defaultMessage: "操作",
  },
  Text_DeviceSetting_Edit: {
    id: "Text-DeviceSetting-Edit",
    defaultMessage: "編輯",
  },
  Text_DeviceSetting_Reboot: {
    id: "Text-DeviceSetting-Reboot",
    defaultMessage: "重啟",
  },
  Text_DeviceSetting_RebootSuccess: {
    id: "Text-DeviceSetting-RebootSuccess",
    defaultMessage: "重啟成功",
  },
  Text_DeviceSetting_RebootFail: {
    id: "Text-DeviceSetting-RebootFail",
    defaultMessage: "重啟失敗",
  },
});
