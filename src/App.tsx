/* eslint-disable */
import * as React from 'react';
import moment from 'moment';
import { inject } from 'mobx-react';
import Router from './components/Router';
import SessionStore from './stores/sessionStore';
import SignalRAspNetCoreHelper from './lib/signalRAspNetCoreHelper';
import Stores from './stores/storeIdentifier';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'antd/dist/antd.less';
import './styles/shared.css';
import './styles/shared.less';
import localization from './lib/localization';
import timingHelper from './lib/timingHelper';

export interface IAppProps {
  sessionStore?: SessionStore;
}
declare let abp: any;

@inject(Stores.SessionStore)
class App extends React.Component<IAppProps> {
  async componentDidMount() {
    timingHelper.initTiming();
    moment.locale(localization.getCurrentLanguage());
    await this.props.sessionStore!.getCurrentLoginInformations();
    this.resolveCSSLanguageFile();
    if (
      !!this.props.sessionStore!.currentLogin.user
      //&&this.props.sessionStore!.currentLogin.application.features['SignalR']
    ) {
      //if (this.props.sessionStore!.currentLogin.application.features['SignalR.AspNetCore']) {
      SignalRAspNetCoreHelper.initSignalR();
      // }
    }
  }

  resolveCSSLanguageFile = () => {
    if (localization.isRTL()) {
      const cssFile = document.createElement('link');
      cssFile.href = '/rtl.css';
      cssFile.rel = 'stylesheet';
      document.head.appendChild(cssFile);
    } else {
      const cssFile = document.createElement('link');
      cssFile.href = '/ltr.css';
      cssFile.rel = 'stylesheet';
      document.head.appendChild(cssFile);
    }
  };

  public render() {
    return <Router />;
  }
}

export default App;
