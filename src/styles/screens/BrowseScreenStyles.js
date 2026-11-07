import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 14, marginBottom: 8, paddingHorizontal: 14 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, fontWeight: '500' },
  clearBtn: { padding: 4 },
  categoryFilters: { marginTop: 4 },
  categoryFilterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  filterBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontWeight: '800', fontSize: 13 },
  listContent: { padding: 16, paddingTop: 8, paddingBottom: 36 },
  card: { marginBottom: 14 },
  emptyContainer: { alignItems: 'center', paddingVertical: 44 },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  emptySubtitle: { fontSize: 13, textAlign: 'center' },
});
