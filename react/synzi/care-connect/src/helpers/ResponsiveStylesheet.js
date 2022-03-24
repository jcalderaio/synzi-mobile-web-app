import { Dimensions, Platform, PixelRatio } from 'react-native';
import { allowSidebar } from '../../../_shared/src/OrientationResponsiveComponent'

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / (allowSidebar ? 550 : 350);

export function normalize(size) {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export const isPortrait = SCREEN_HEIGHT >= SCREEN_WIDTH