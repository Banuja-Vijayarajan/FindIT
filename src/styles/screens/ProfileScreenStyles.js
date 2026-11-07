import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 40 },
  avatarCard: { alignItems: 'center', padding: 24, marginBottom: 20 },
  avatarCircle: { width: 76, height: 76, borderRadius: 38, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarInitial: { fontSize: 34, fontWeight: '800', color: '#FFFFFF' },
  userName: { fontSize: 21, fontWeight: '800', marginBottom: 4 },
  userEmail: { fontSize: 14, marginBottom: 14 },
  statsBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 50 },
  statsText: { fontSize: 12, fontWeight: '700' },
  sectionHeading: { fontSize: 12, fontWeight: '800', marginBottom: 8, marginLeft: 6, letterSpacing: 0.6 },
  card: { padding: 18, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 15, fontWeight: '700' },
  inputLabel: { fontSize: 13, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 6 },
  input: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 14, fontWeight: '500' },
  saveButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
