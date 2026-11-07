import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  pill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillIcon: {
    marginRight: 6,
  },
  label: {
    marginBottom: 2,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
