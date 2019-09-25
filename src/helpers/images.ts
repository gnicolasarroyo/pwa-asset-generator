import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';
import constants from '../config/constants';
import { Image, Orientation } from '../models/image';
import {
  DeviceFactorSpec,
  LaunchScreenSpec,
  SplashScreenSpec,
} from '../models/spec';
import { Options } from '../models/options';

const mapToSqImageFileObj = (fileNamePrefix: string, size: number): Image => ({
  name: `${fileNamePrefix}-${size}`,
  width: size,
  height: size,
  orientation: null,
});

const mapToImageFileObj = (
  fileNamePrefix: string,
  width: number,
  height: number,
  scaleFactor: number,
  orientation: Orientation,
): Image => ({
  name: `${fileNamePrefix}-${width}-${height}`,
  width,
  height,
  scaleFactor,
  orientation,
});

const getIconImages = (): Image[] => {
  return uniqWith(
    [
      ...constants.APPLE_ICON_SIZES.map(size =>
        mapToSqImageFileObj(constants.APPLE_ICON_FILENAME_PREFIX, size),
      ),
      ...constants.MANIFEST_ICON_SIZES.map(size =>
        mapToSqImageFileObj(constants.MANIFEST_ICON_FILENAME_PREFIX, size),
      ),
    ],
    isEqual,
  );
};

const getSplashScreenImages = (
  uniformSplashScreenData: SplashScreenSpec[],
  options: Options,
): Image[] => {
  return uniqWith(
    uniformSplashScreenData.reduce((acc: Image[], curr: SplashScreenSpec) => {
      let images: Image[] = acc;
      if (!options.landscapeOnly) {
        images = [
          ...images,
          mapToImageFileObj(
            constants.APPLE_SPLASH_FILENAME_PREFIX,
            curr.portrait.width,
            curr.portrait.height,
            curr.scaleFactor,
            'portrait',
          ),
        ];
      }
      if (!options.portraitOnly) {
        images = [
          ...images,
          mapToImageFileObj(
            constants.APPLE_SPLASH_FILENAME_PREFIX,
            curr.landscape.width,
            curr.landscape.height,
            curr.scaleFactor,
            'landscape',
          ),
        ];
      }
      return images;
    }, []),
    isEqual,
  );
};

const getSplashScreenScaleFactorUnionData = (
  launchScreenSpecs: LaunchScreenSpec[],
  deviceFactorSpecs: DeviceFactorSpec[],
): SplashScreenSpec[] => {
  return launchScreenSpecs.map((launchScreenSpec: LaunchScreenSpec) => {
    const matchedDevice = deviceFactorSpecs.find(
      (deviceFactorSpec: DeviceFactorSpec) =>
        deviceFactorSpec.device === launchScreenSpec.device,
    );

    if (matchedDevice) {
      return {
        ...launchScreenSpec,
        scaleFactor: matchedDevice.scaleFactor,
      } as SplashScreenSpec;
    }

    return launchScreenSpec as SplashScreenSpec;
  });
};

export default {
  getIconImages,
  getSplashScreenImages,
  getSplashScreenScaleFactorUnionData,
};
