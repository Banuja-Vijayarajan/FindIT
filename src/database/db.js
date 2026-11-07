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
    status: 'active',
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
    status: 'active',
  },
];

// Create table if it does not exist and migrate columns from earlier versions
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
        imageUri TEXT,
        status TEXT NOT NULL DEFAULT 'active'
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
    try { db.execSync("ALTER TABLE items ADD COLUMN status TEXT NOT NULL DEFAULT 'active';"); } catch (_) {}

    // Add initial samples if table is empty
    const check = db.getFirstSync('SELECT COUNT(*) as count FROM items');
    if (check && check.count === 0) {
      for (const item of items) {
        db.runSync(
          'INSERT INTO items (title, location, type, contact, description, category, date, imageUri, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            item.title,
            item.location,
            item.type,
            item.contact,
            item.description,
            item.category || 'General',
            item.date || '',
            item.imageUri || '',
            item.status || 'active',
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

// Get only reports that are still active
export const getActiveItems = () => {
  if (Platform.OS === 'web' || !db) {
    return items.filter((item) => String(item.status || 'active').toLowerCase() === 'active');
  }
  try {
    return db.getAllSync("SELECT * FROM items WHERE status = 'active' ORDER BY id DESC");
  } catch (e) {
    console.log('Error loading active items:', e);
    return items.filter((item) => String(item.status || 'active').toLowerCase() === 'active');
  }
};

// Get active reports for a selected category
export const getActiveItemsByCategory = (category) => {
  if (!category || category === 'All') return getActiveItems();
  if (Platform.OS === 'web' || !db) {
    return items.filter(
      (item) => String(item.status || 'active').toLowerCase() === 'active' && item.category === category
    );
  }
  try {
    return db.getAllSync(
      "SELECT * FROM items WHERE status = 'active' AND category = ? ORDER BY id DESC",
      [category]
    );
  } catch (e) {
    console.log('Error loading active items by category:', e);
    return items.filter(
      (item) => String(item.status || 'active').toLowerCase() === 'active' && item.category === category
    );
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
      category: newItem.category || 'General',
      contact: newItem.contact,
      description: newItem.description || '',
      date: currentDate,
      imageUri: itemImage,
      status: 'active',
    };
    items = [item, ...items];
    return item;
  }

  try {
    db.runSync(
      'INSERT INTO items (title, location, type, contact, description, category, date, imageUri, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newItem.title,
        newItem.location,
        itemType,
        newItem.contact,
        newItem.description || '',
        newItem.category || 'General',
        currentDate,
        itemImage,
        'active',
      ]
    );
  } catch (e) {
    console.log('Insert error, trying fallback query:', e);
    try {
      db.runSync(
        "INSERT INTO items (title, location, type, contact, description, category, status) VALUES (?, ?, ?, ?, ?, ?, 'active')",
        [newItem.title, newItem.location, itemType, newItem.contact, newItem.description || '', newItem.category || 'General']
      );
    } catch (err) {
      console.log('Final fallback failed:', err);
    }
  }
};

// Delete a report by ID
export const deleteItem = (id) => {
  if (Platform.OS === 'web' || !db) {
    const previousCount = items.length;
    items = items.filter((item) => String(item.id) !== String(id));
    return items.length < previousCount;
  }
  try {
    const result = db.runSync('DELETE FROM items WHERE id = ?', [id]);
    return result.changes > 0;
  } catch (e) {
    console.log('Error deleting item:', e);
    return false;
  }
};

const updateItemStatus = (id, status) => {
  if (Platform.OS === 'web' || !db) {
    const item = items.find((entry) => String(entry.id) === String(id));
    if (!item) return false;
    item.status = status;
    return true;
  }

  try {
    const result = db.runSync('UPDATE items SET status = ? WHERE id = ?', [status, id]);
    return result.changes > 0;
  } catch (e) {
    console.log('Error updating item status:', e);
    return false;
  }
};

// Mark an item as claimed/returned and hide it from active browse lists
export const markItemAsClaimed = (id) => updateItemStatus(id, 'claimed');

// Retained for callers that use the resolved status label
export const markItemAsResolved = (id) => updateItemStatus(id, 'resolved');
