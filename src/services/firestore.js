import { firestore } from 'firebase'; // Assuming you have firebase setup

const db = firestore();

// Function to add a contact
const addContact = async (contact) => {
  try {
    await db.collection('EmergencyContacts').add(contact);
    console.log('Contact added successfully');
  } catch (error) {
    console.error('Error adding contact: ', error);
  }
};

// Function to edit a contact
const editContact = async (id, updatedContact) => {
  try {
    await db.collection('EmergencyContacts').doc(id).update(updatedContact);
    console.log('Contact updated successfully');
  } catch (error) {
    console.error('Error updating contact: ', error);
  }
};

// Function to remove a contact
const removeContact = async (id) => {
  try {
    await db.collection('EmergencyContacts').doc(id).delete();
    console.log('Contact removed successfully');
  } catch (error) {
    console.error('Error removing contact: ', error);
  }
};
