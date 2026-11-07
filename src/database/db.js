import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

// Open SQLite database on mobile; null on web
let db = null;
if (Platform.OS !== 'web') {
  try {
    db = SQLite.openDatabaseSync('findit.db');
  } catch (e) {
    console.log('Database error:', e);
  }
}

// Initial sample data with imageUri support
let items = [
  {
    id: 1,
    title: 'Blue Water Bottle',
    location: 'Main Library 2nd Floor',
    type: 'Lost',
    contact: '0712345678',
    description: 'Left on the study table near window.',
    category: 'Bottle',
    date: new Date().toISOString().split('T')[0],
    imageUri: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
  },
  {
    id: 2,
    title: 'Room Keys with Red Ribbon',
    location: 'Canteen Bench',
    type: 'Found',
    contact: 'campus.security@mail.com',
    description: 'Found around 2 PM near table 4.',
    category: 'Keys',
    date: new Date().toISOString().split('T')[0],
    imageUri: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80',
  },
];

// Create table if it does not exist & ensure imageUri column exists
export const initDatabase = () => {
  if (Platform.OS === 'web' || !db) return;
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        location TEXT,
        type TEXT,
        contact TEXT,
        description TEXT,
        category TEXT,
        date TEXT,
        imageUri TEXT
      );
    `);

    // Ensure columns exist even if table was created in an earlier build
    try { db.execSync('ALTER TABLE items ADD COLUMN category TEXT;'); } catch (_) {}
    try { db.execSync('ALTER TABLE items ADD COLUMN date TEXT;'); } catch (_) {}
    try { db.execSync('ALTER TABLE items ADD COLUMN contact TEXT;'); } catch (_) {}
    try { db.execSync('ALTER TABLE items ADD COLUMN description TEXT;'); } catch (_) {}
    try { db.execSync('ALTER TABLE items ADD COLUMN location TEXT;'); } catch (_) {}
    try { db.execSync('ALTER TABLE items ADD COLUMN type TEXT;'); } catch (_) {}
    try { db.execSync('ALTER TABLE items ADD COLUMN imageUri TEXT;'); } catch (_) {}

    // Add initial samples if table is empty
    const check = db.getFirstSync('SELECT COUNT(*) as count FROM items');
    if (check && check.count === 0) {
      for (const item of items) {
        db.runSync(
          'INSERT INTO items (title, location, type, contact, description, category, date, imageUri) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            item.title,
            item.location,
            item.type,
            item.contact,
            item.description,
            item.category || 'General',
            item.date || '',
            item.imageUri || '',
          ]
        );
      }
    }
  } catch (e) {
    console.log('Error initializing table:', e);
  }
};

// Get all items
export const getItems = () => {
  if (Platform.OS === 'web' || !db) return items;
  try {
    return db.getAllSync('SELECT * FROM items ORDER BY id DESC');
  } catch (e) {
    return items;
  }
};

// Add a new report
export const addItem = (newItem) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const itemType = newItem.type || 'Lost';
  const itemImage = newItem.imageUri || '';

  if (Platform.OS === 'web' || !db) {
    const item = {
      id: Date.now(),
      title: newItem.title,
      location: newItem.location,
      type: itemType,
      contact: newItem.contact,
      description: newItem.description || '',
      category: newItem.category || 'General',
      date: currentDate,
      imageUri: itemImage,
    };
    items = [item, ...items];
    return item;
  }

  try {
    db.runSync(
      'INSERT INTO items (title, location, type, contact, description, category, date, imageUri) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newItem.title,
        newItem.location,
        itemType,
        newItem.contact,
        newItem.description || '',
        newItem.category || 'General',
        currentDate,
        itemImage,
      ]
    );
  } catch (e) {
    console.log('Insert error, trying fallback query:', e);
    try {
      db.runSync(
        'INSERT INTO items (title, location, type, contact, description) VALUES (?, ?, ?, ?, ?)',
        [newItem.title, newItem.location, itemType, newItem.contact, newItem.description || '']
      );
    } catch (err) {
      console.log('Final fallback failed:', err);
    }
  }
};

// Delete a report by ID
export const deleteItem = (id) => {
  if (Platform.OS === 'web' || !db) {
    items = items.filter((item) => item.id !== id);
    return;
  }
  try {
    db.runSync('DELETE FROM items WHERE id = ?', [id]);
  } catch (e) {
    console.log('Error deleting item:', e);
  }
};
