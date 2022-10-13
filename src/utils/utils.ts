import * as abpTypings from '../lib/abp';

import { routers } from '../components/Router/router.config';
import { L } from '../i18next';
import userService from '../services/user/userService';

declare var abp: any;

class Utils {
  loadScript(url: string) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
  }

  getScript(source: string, callback: any) {
    var script: any = document.createElement('script');
    var prior: any = document.getElementsByTagName('script')[0];
    script.async = true;

    script.onload = script.onreadystatechange = function (_: any, isAbort: boolean) {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = script.onreadystatechange = null;
        script = undefined;

        if (!isAbort && callback) setTimeout(callback, 0);
      }
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
  }

  getPageTitleForHeader = (pathname: string) => {
    const route = routers.filter((route) => route.path === pathname);
    const localizedAppName = L('MOHRA');
    if (pathname.indexOf('/product/') > -1) {
      return L('ProductDetails');
    }
    if (pathname.indexOf('/order/') > -1) {
      return L('OrderDetails');
    }
    if (pathname.indexOf('/payment/') > -1) {
      return L('PaymentDetails');
    }
    if (pathname.indexOf('/category/') > -1) {
      return L('CategoryDetails');
    }
    if (pathname.indexOf('/my-category/') > -1) {
      return L('CategoryDetails');
    }
    if (!route || route.length === 0) {
      return localizedAppName;
    }

    return L(route[0].title);
  };
  extend(...args: any[]) {
    let options,
      name,
      src,
      srcType,
      copy,
      copyIsArray,
      clone,
      target = args[0] || {},
      i = 1,
      length = args.length,
      deep = false;
    if (typeof target === 'boolean') {
      deep = target;
      target = args[i] || {};
      i++;
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {};
    }
    if (i === length) {
      target = this;
      i--;
    }
    for (; i < length; i++) {
      if ((options = args[i]) !== null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          srcType = Array.isArray(src) ? 'array' : typeof src;
          if (deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && srcType === 'array' ? src : [];
            } else {
              clone = src && srcType === 'object' ? src : {};
            }
            target[name] = this.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    return target;
  }

  getPageTitle = (pathname: string) => {
    const route = routers.filter((route) => route.path === pathname);
    const localizedAppName = L('MOHRA');
    if (!route || route.length === 0) {
      return localizedAppName;
    }

    return L(route[0].title) + ' | ' + localizedAppName;
  };

  getRoute = (path: string): any => {
    return routers.filter((route) => route.path === path)[0];
  };

  setLocalization() {
    if (!abp.utils.getCookieValue('Abp.Localization.CultureName')) {
      let language = navigator.language;
      abp.utils.setCookieValue(
        'Abp.Localization.CultureName',
        language,
        new Date(new Date().getTime() + 5 * 365 * 86400000),
        abp.appPath
      );
    }
  }

  getCurrentClockProvider(currentProviderName: string): abpTypings.timing.IClockProvider {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
      return abp.timing.utcClockProvider;
    }

    return abp.timing.localClockProvider;
  }

  async checkIfGrantedPermission(permission: string) {
    let result = await userService.checkIfGrantedPermission(permission);
    return result;
  }
}

export default new Utils();
