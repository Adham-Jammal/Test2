import i18n from 'i18next';
import moment from 'moment';
import localization from './localization';

class TimingHelper {
  defaultDateTimeFormat = 'D/MM/YYYY - h:mm A';
  defaultTimeFormat = 'hh:mm A';
  defaultDateFormat = 'MM/D/YYYY';

  initTiming() {
    moment.updateLocale(i18n.language, localization.getMomentLocals());
  }
}

export default new TimingHelper();
