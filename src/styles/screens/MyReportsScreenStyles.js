import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 36 },
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, padding: 14 },
  resolvedCard: { opacity: 0.78 },
  cardContent: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  deleteBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', paddingVertical: 0, paddingHorizontal: 0 },
  emptyContainer: { alignItems: 'center', paddingVertical: 48, marginTop: 20 },
  emptyTitle: { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  emptySubtitle: { fontSize: 13, marginBottom: 18, textAlign: 'center' },
  createBtn: { paddingHorizontal: 22, paddingVertical: 12 },
  createBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
