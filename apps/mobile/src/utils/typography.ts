import { TextStyle } from 'react-native';

export const Typography = {
  titleXL: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,
  titleL: {
    fontSize: 22,
    fontWeight: '700',
  } as TextStyle,
  titleM: {
    fontSize: 18,
    fontWeight: '600',
  } as TextStyle,
  titleS: {
    fontSize: 15,
    fontWeight: '600',
  } as TextStyle,
  body: {
    fontSize: 15,
    fontWeight: '400',
  } as TextStyle,
  bodySm: {
    fontSize: 13,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontSize: 11,
    fontWeight: '400',
  } as TextStyle,
} as const;
