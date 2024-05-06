'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

const Geolocation$1 = core.registerPlugin('Geolocation', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.GeolocationWeb()),
});

const geolocationToPosition = function (geoPosition) {
    return {
        timestamp: geoPosition.timestamp,
        coords: {
            accuracy: geoPosition.coords.accuracy,
            altitude: geoPosition.coords.altitude,
            altitudeAccuracy: geoPosition.coords.altitudeAccuracy,
            heading: geoPosition.coords.heading,
            latitude: geoPosition.coords.latitude,
            longitude: geoPosition.coords.longitude,
            speed: geoPosition.coords.speed,
            isMock: false,
        },
    };
};
class GeolocationWeb extends core.WebPlugin {
    async getCurrentPosition(options) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(pos => {
                if (!pos) {
                    resolve(pos);
                    return;
                }
                resolve(geolocationToPosition(pos));
            }, err => {
                reject(err);
            }, Object.assign({ enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, options));
        });
    }
    async watchPosition(options, callback) {
        const id = navigator.geolocation.watchPosition(pos => {
            if (!pos) {
                callback(pos);
                return;
            }
            callback(geolocationToPosition(pos));
        }, err => {
            callback(null, err);
        }, Object.assign({ enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }, options));
        return `${id}`;
    }
    async clearWatch(options) {
        window.navigator.geolocation.clearWatch(parseInt(options.id, 10));
    }
    async checkPermissions() {
        if (typeof navigator === 'undefined' || !navigator.permissions) {
            throw this.unavailable('Permissions API not available in this browser');
        }
        const permission = await window.navigator.permissions.query({
            name: 'geolocation',
        });
        return { location: permission.state, coarseLocation: permission.state };
    }
    async requestPermissions() {
        throw this.unimplemented('Not implemented on web.');
    }
}
const Geolocation = new GeolocationWeb();

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    GeolocationWeb: GeolocationWeb,
    Geolocation: Geolocation
});

exports.Geolocation = Geolocation$1;
//# sourceMappingURL=plugin.cjs.js.map
