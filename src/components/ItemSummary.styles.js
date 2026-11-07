import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#E8DAD6',
  },
  compactImage: {
    width: 64,
    height: 64,
  },
  reportImage: {
    width: 60,
    height: 60,
    marginRight: 0,
  },
  placeholder: {
    width: 68,
    height: 68,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactPlaceholder: {
    width: 64,
    height: 64,
  },
  reportPlaceholder: {
    width: 60,
    height: 60,
    marginRight: 0,
  },
  details: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
});
