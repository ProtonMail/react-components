import { getOS, getBrowser, getDevice } from 'proton-shared/lib/helpers/browser';
import { CLIENT_ID_KEYS, CLIENT_IDS } from 'proton-shared/lib/constants';

export const getClient = (clientID: CLIENT_ID_KEYS) => {
    return CLIENT_IDS[clientID];
};

export const collectInfo = () => {
    const os = getOS();
    const browser = getBrowser();
    const device = getDevice();

    const info = {
        OS: os.name,
        OSVersion: os.version || '',
        Browser: browser.name,
        BrowserVersion: browser.version,
        Resolution: `${window.innerHeight} x ${window.innerWidth}`,
        DeviceName: device.vendor,
        DeviceModel: device.model,
    };

    const isTouchDevice = navigator.maxTouchPoints > 1;

    if (info.OS === 'Mac OS' && isTouchDevice) {
        info.OS = 'iOS';
        info.OSVersion = '';
    }

    if (info.OS === 'Linux' && isTouchDevice) {
        info.OS = 'Android';
        info.OSVersion = '';
    }

    return info;
};
