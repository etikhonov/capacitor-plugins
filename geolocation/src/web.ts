import { WebPlugin } from '@capacitor/core';

import type {
  CallbackID,
  GeolocationPlugin,
  PermissionStatus,
  Position,
  PositionOptions,
  WatchPositionCallback,
} from './definitions';

const geolocationToPosition = function (
  geoPosition: GeolocationPosition,
): Position {
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
export class GeolocationWeb extends WebPlugin implements GeolocationPlugin {
  async getCurrentPosition(options?: PositionOptions): Promise<Position> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          if (!pos) {
            resolve(pos);
            return;
          }
          resolve(geolocationToPosition(pos));
        },
        err => {
          reject(err);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
          ...options,
        },
      );
    });
  }

  async watchPosition(
    options: PositionOptions,
    callback: WatchPositionCallback,
  ): Promise<CallbackID> {
    const id = navigator.geolocation.watchPosition(
      pos => {
        if (!pos) {
          callback(pos);
          return;
        }
        callback(geolocationToPosition(pos));
      },
      err => {
        callback(null, err);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
        ...options,
      },
    );

    return `${id}`;
  }

  async clearWatch(options: { id: string }): Promise<void> {
    window.navigator.geolocation.clearWatch(parseInt(options.id, 10));
  }

  async checkPermissions(): Promise<PermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      throw this.unavailable('Permissions API not available in this browser');
    }

    const permission = await window.navigator.permissions.query({
      name: 'geolocation',
    });
    return { location: permission.state, coarseLocation: permission.state };
  }

  async requestPermissions(): Promise<PermissionStatus> {
    throw this.unimplemented('Not implemented on web.');
  }
}

const Geolocation = new GeolocationWeb();

export { Geolocation };
