import AppConsts from './appconst';
import Util from '../utils/utils';
import { NotificationDataDto } from '../services/notifications/dto';

declare var abp: any;

class SignalRAspNetCoreHelper {
  initSignalR() {
    var encryptedAuthToken = abp.auth.getEncryptedAccessToken();

    abp.signalr = {
      autoConnect: true,
      connect: undefined,
      hubs: undefined,
      qs:
        AppConsts.authorization.encrptedAuthTokenName +
        '=' +
        encodeURIComponent(encryptedAuthToken),
      remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
      url: 'signalr-notificationHub',
      startConnection: undefined,
    };
    // Util.loadScript(AppConsts.appBaseUrl + 'signalr.min.js');

    // let loaded = Util.loadScript(AppConsts.appBaseUrl + 'abp.signalr-client.js');
    // if(loaded){
    //   abp.signalr.hubs.common!.on('getMessage', function (message: any) {
    //     // Register for incoming messages
    //     console.log('received message: ' + message);
    //   })
    // }
    Util.getScript(AppConsts.appBaseUrl + 'abp.signalr-client.js', () => {
      abp.signalr!.hubs!.common!.on('getNotification', function (data: NotificationDataDto) {
        console.log('received notification: ' + data);
      });
    });
  }
}
export default new SignalRAspNetCoreHelper();
