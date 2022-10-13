const AppConsts = {
  userManagement: {
    defaultAdminUserName: 'admin',
  },
  localization: {
    defaultLocalizationSourceName: 'MOHRA',
  },
  authorization: {
    encrptedAuthTokenName: 'enc_auth_token',
  },
  appBaseUrl: process.env.REACT_APP_APP_BASE_URL,
  remoteServiceBaseUrl: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
  uploadImageEndpoint: `${process.env.REACT_APP_REMOTE_SERVICE_BASE_URL}api/services/app/Image/UploadImage`,
  uploadVoiceEndpoint: `${process.env.REACT_APP_REMOTE_SERVICE_BASE_URL}api/services/app/Image/UploadVoice`,
  uploadVideoEndpoint: `${process.env.REACT_APP_REMOTE_SERVICE_BASE_URL}api/services/app/Image/UploadVideo`,
};
export default AppConsts;
