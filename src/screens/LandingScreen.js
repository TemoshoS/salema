import React, { useEffect, useState, useRef } from "react";

// from home script
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import ChipButton from "../components/ChipButton";
import {
  getContacts,
  addContact,
  updateContact,
  removeContact,
} from "../services/homeServices";
import { Ionicons } from '@expo/vector-icons';

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from 'react-native-root-siblings';


import Button from "../components/Button";
import Button2 from "../components/Button2";
import InputText from "../components/InputText";
import { FontAwesome } from '@expo/vector-icons';
//
import { Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";
import { initializeAuthState } from "../services/homeServices";

import { ShakeEventExpo, sendSMS } from "../services/ShakeTrigger";
import getLocationPermission from "../services/geolocation";
import * as Notifications from "expo-notifications";
import ForgotPassword from "./ForgotPassword";
import authService from "../services/authService";
import Toast from 'react-native-toast-message';
import PhoneInput from "react-native-phone-number-input";


const LandingScreen = ({ navigation, visible }) => {



  const { checkUserLoggedIn, user } = authService()

  const [phone, setPhone] = useState('');
  const phoneInput = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [updatedContact, setUpdatedContact] = useState("");
  const [removedContact, setRemovedContact] = useState("");
  // from home scrip[t]
  const [loadContacts, setLoadingContact] = useState(false)
  const [currentUser, setCurrentUser] = useState(user);
  const [contacts, setContacts] = useState([]);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddContactModalVisible, setAddContactModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [relationshipError, setRelationshipError] = useState(null);
  const [isShakeHandled, setIsShakeHandled] = useState(false);
  const [statusImageSource, setStatusImageSource] = useState(require('../../assets/inactiveIcon.png'));
  const [location, setLocation] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [shakeStatusModalVisible, setShakeStatusModalVisible] = useState(false);
  const [newContactData, setNewContactData] = useState({
    name: "",
    phoneNumber: "",
    relationship: "",
  });
  // Modal Management
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [isViewContactModalVisible, setIsViewContactModalVisible] =
    useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSignupModalVisible, setSignupModalVisible] = useState(false);
  const [isForgotPassModalVisible, setForgotPassModalVisible] = useState(false);
  const [updatedContactData, setUpdatedContactData] = useState({
    name: "",
    phoneNumber: "",
    relationship: "",
  });
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["20%", "35%"];
  const [isOpenContact, setOpenContact] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [contactIdToRemove, setContactIdToRemove] = useState(null);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const relationshipRef = useRef(null);

  const nameUpdateRef = useRef(null);
  const phoneUpdateRef = useRef(null);
  const relationshipUpdateRef = useRef(null);


  const [loading, setLoading] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [loadingAdd, setLoadingAdd] = useState(false)
  useEffect(() => {

    initializeAuth();
    // fetchContacts()
    const shakeHandler = async () => {
      console.log("Shake detected!");
      //console.log(contacts);

      const permissionResult = await getLocationPermission();

      if (permissionResult) {
        const newLocation = permissionResult.userLocation;
        setLocation(newLocation);
        setShakeStatusModalVisible(true);
        handleShake(true);
        sendSMS(
          "Hi it's " + currentUser.displayName + " Emergency! I need help. My location: " +
          `https://www.google.com/maps/?q=${newLocation.latitude},${newLocation.longitude}`
        );
      }

    };

    ShakeEventExpo.addListener(shakeHandler);

    return () => {
      ShakeEventExpo.removeListener(shakeHandler);
    };
  }, [isShakeHandled]);

  useEffect(() => {
    // This effect will run when currentUser is updated
    fetchContacts();
    initializeAuthState();
  }, [currentUser]);

  const initializeAuth = async () => {

    try {
      const user = await checkUserLoggedIn();

      if (user != null) {
        setCurrentUser(user);
        // console.log("There is a user", user);
      } else {
        setContacts([]);
        // console.log("Not logged in user");
      }
    } catch (error) {
      console.error("Error during authentication initialization:", error);
    } finally {
      setLoading(false);
    }

  };

  // Function to get user's contacts
  const fetchContacts = async () => {

    try {
      setLoadingContact(true);
      //console.log('fetching contact');
      //console.log(currentUser);
      const data = await getContacts(currentUser);

      //console.log("contacts", data);
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoadingContact(false); // Set loading state back to false after fetching
    }

  };

  const showContactDetails = (contact) => {
    setSelectedContact(contact);
    setUpdatedContactData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
    });
    // setConfirmationVisible(true)
    setIsViewContactModalVisible(true);
  };

  const showUpdateModal = () => {
    bottomSheetModalRef.current?.close();
    setUpdateModalVisible(true);
    hideViewContactModal();
  };

  function handleViewContact(contact) {

    bottomSheetModalRef.current?.present();
    setModalData(contact);


    setTimeout(() => {
      setOpenContact(true);
    }, 100);
  }
  // from home
  const showAddContactModal = () => {
    setNewContactData({
      name: "",
      phoneNumber: "",
      relationship: "",
    });
    setAddContactModalVisible(true);
  };

  const hideAddContactModal = () => {
    setAddContactModalVisible(false);
  };

  const validatePhoneNumber = (text) => {
    const isValid = phoneInput.current?.isValidNumber(text);
    if (!isValid) {
      setPhoneError('Invalid phone number');
    } else {
      setPhoneError('');
    }
    setNewContactData({ ...newContactData, phoneNumber: text });
  };

  const handleAddContact = async () => {
    try {
        setLoadingAdd(true);

        if (!currentUser) {
            // Alert user to sign in or create an account to see the contact list
            Alert.alert(
                "Not Signed In",
                "Please sign in or register to add a contact.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            setTimeout(() => {
                                navigation.navigate("LandingPage");
                            }, 2000);
                        },
                    },
                ]
            );
            setLoadingAdd(false);
            return;
        }

        // Trim spaces from the name and phone number
        const trimmedName = newContactData.name.trim();
        const trimmedPhoneNumber = newContactData.phoneNumber.trim();
        const trimmedRelationship = newContactData.relationship.trim();

        if (!trimmedName) {
            setNameError("Please enter Name");
            setLoadingAdd(false);
            return;
        } else {
            setNameError(null);
        }

        if (!trimmedPhoneNumber) {
            setPhoneError("Please enter Phone number");
            setLoadingAdd(false);
            return;
        }

        const isValid = phoneInput.current?.isValidNumber(trimmedPhoneNumber);
        if (!isValid) {
            setPhoneError("Invalid phone number");
            setLoadingAdd(false);
            return;
        } else {
            setPhoneError(null);
        }

        if (!trimmedRelationship) {
            setRelationshipError("Please enter Relationship");
            setLoadingAdd(false);
            return;
        } else {
            setRelationshipError(null);
        }

        const contactWithUserId = {
            ...newContactData,
            name: trimmedName,
            phoneNumber: trimmedPhoneNumber,
            relationship: trimmedRelationship,
            userId: currentUser.uid,
        };

        await addContact(contactWithUserId).then(() => {
            setLoading(false);
        });

        Toast.show({
            type: 'success',
            text1: 'Contact Added',
            visibilityTime: 3000,
        });

        fetchContacts().then(() => {});
        hideAddContactModal();
    } catch (error) {
        console.error("Error adding contact: ", error);
    } finally {
        setLoadingAdd(false);
    }
};

  

  const selectContactForUpdate = (contact) => {
    setUpdatedContactData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
    });
    setIsEditing(true);
  };

  // modal stuff

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleUpdateContact = async () => {
    try {
      setLoadingUpdate(true);
      console.log(modalData.id);
  
      if (!modalData.id) {
        console.error("Selected contact has no valid ID");
        setLoading(false);
        return;
      }
  
      if (!modalData) {
        console.error("No updated data provided");
        setLoadingUpdate(false);
        return;
      }
  
      if (!modalData.name) {
        setNameError('Please enter Name');
        setLoadingUpdate(false);
        return;
      } else {
        setNameError(null);
      }
  
      if (!modalData.phoneNumber) {
        setPhoneError('Please enter Phone number');
        setLoading(false);
        return;
      } else {
        setPhoneError(null);
      }
  
      if (!modalData.relationship) {
        setRelationshipError('Please enter Relationship');
        setLoadingUpdate(false);
        return;
      } else {
        setRelationshipError(null);
      }
  
      await updateContact(modalData.id, modalData);
      fetchContacts();
      hideUpdateModal();
      setConfirmationVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Successfully updated the emergency contact',
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error updating contact: ", error);
    } finally {
      setLoadingUpdate(false);
    }
  };
  

  const showSignupModal = () => {
    setLoginModalVisible(false);
    setSignupModalVisible(true);
  };
  const showLoginModal = () => {
    setSignupModalVisible(false);
    setLoginModalVisible(true);
  };
  const showForgotPassModal = () => {
    setLoginModalVisible(false);
    setForgotPassModalVisible(true);
  };
  const handleRemoveContact = async (contactId) => {
    try {
      await removeContact(contactId).then(() => {
        fetchContacts();
        bottomSheetModalRef.current?.close();
        Toast.show({
          type: 'success',
          text1: 'Emergency contact removed successful',
          visibilityTime: 3000,
        });
      })

    } catch (error) {
      console.error("Error removing contact: ", error);
      Toast.show({
        type: 'error',
        text1: 'Emergecny contact not removed',
        text2: 'Please try again',
        visibilityTime: 3000,
      });
    }
  };

  // Function to hide the confirmation modal
  const hideConfirmation = () => {
    setConfirmationVisible(false);
  };
  // Function to hide the Update/Edit modal
  const hideUpdateModal = () => {
    setUpdateModalVisible(false);
  };
  // Hide Login Modal
  const hideLoginModal = () => {
    // setCurrentUser(user)
    initializeAuth().then(() => {
      setLoginModalVisible(false);
    })
  };
  // Hide  Signin Modal
  const hideSignupModal = () => {
    setSignupModalVisible(false);
  };
  // Hide  Forgot/Reset Password  Modal
  const hideForgotPassModal = () => {
    setForgotPassModalVisible(false);

  };
  // Hide  Contact Modal
  const hideViewContactModal = () => {
    setIsViewContactModalVisible(false);
  };
  const showViewContactModal = (contact) => {
    setSelectedContact(contact);
    setUpdatedContactData({
      name: contact.name,
      // phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
    });
    setIsViewContactModalVisible(true);
  };

  const handleLogin = () => {
    setLoginModalVisible(true);
  };

  const handleSignup = () => {
    setSignupModalVisible(true);
  };

  // bottom sheet stuff

  // modal  controls
  const handleModalPress = (event) => {
    // Check if the touch event is within the modal content
    if (event.target === event.currentTarget) {
      onClose(); // Close the modal only if the user clicked outside the content
    }
  };

  const handleShake = async (shakeDetected) => {
    if (!isShakeHandled) {
      setIsShakeHandled(true); // Set to true to indicate that shake is handled

      if (shakeDetected) {
        setStatusImageSource(require('../../assets/activatingIcon.png')); // Orange

        setTimeout(() => {
          setStatusImageSource(require('../../assets/activeIcon.png')); // Green

          // Show location modal
          setLocationModalVisible(true);

          sendNotification();

          setTimeout(() => {
            setStatusImageSource(require('../../assets/inactiveIcon.png')); // Red after 10 seconds
            setIsShakeHandled(false); // Reset shake handling
          }, 10000);
        }, 1000);
      } else {
        setStatusImageSource(require('../../assets/inactiveIcon.png')); // Red if no shake detected
      }
    }
  };



  const sendNotification = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Salema",
          body: "Alert has been sent to your contacts",
        },
        trigger: null,
      });

      console.log("Notification scheduled: ", notificationId);
    } catch (error) {
      console.error("Error sending notification: ", error);
    }
  };

  return (
    <RootSiblingParent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <View style={styles.container}>
            
            <Image
              source={require("../../assets/no.png")}
              style={styles.logoImg}
              
            />
            <Text style={{ color: "gray", fontSize: 16 }}>Your safety just a shake away</Text>
            {/* Staus image */}

            {/* <View style={styles.textContent}> */}
            <Image
              source={statusImageSource}
              style={styles.BgImage}
              accessibilityLabel="status signal image"
            />

            <Text style={styles.title}>"Shake to Alert"</Text>
            <Text style={styles.text}>
              In an emergency, every second counts, just give your phone a quick
              shake to send out an alert to your chosen contacts
            </Text>
            {/* </View> */}

            <Image
              source={require("../../assets/undraw.png")}
              style={styles.BgImage}
              accessibilityLabel="status signalimage"
            />

            {/* Bottom Sheet if user logged in or not */}
            {currentUser == null ? (
              // <></>
              <View style={styles.buttonSection}>
                <Button
                  style={styles.bgGreen}
                  title={"Signup"}
                  onPress={() => handleSignup()}
                  altText={"register"}
                  color={"#055a2b"}
                />
                <Button
                  style={styles.bgGreen}
                  title={"Log in"}
                  onPress={() => handleLogin()}
                  altText={"Login"}
                  color={"#055a2b"}
                />
              </View>
            ) : (
              //  User Is not null && Prompt to add contacts else display avaiable contacts

              <View style={styles.bottomSheet}>
                <Text style={[styles.title, { color: 'white', marginTop: 16 }]}>Trusted Contacts</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

                  {contacts.length > 0 ? (
                    contacts.map((contact, index) => (

                      <View style={styles.contacts} key={index}>
                        <TouchableOpacity style={styles.chip} onPress={() => handleViewContact(contact)} >
                          <Text style={styles.name} >{contact.name}</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <>
                      {loadContacts ?
                        (
                          <View>
                            <ActivityIndicator size="large" color="#00000" />
                          </View>
                        )
                        : (<>
                          <View style={{ margin: 15, alignItems: 'center' }}>
                            <Text style={[styles.noUserText, { fontWeight: 'bold' }]}>
                              YOUR EMERGENCY CONTACTS WILL APPEAR HERE.
                            </Text>
                            <Text style={styles.noUserText}>
                              You currently do not have any emergency contact. Import
                              contacts or add new contacts
                            </Text>
                          </View>
                        </>)}
                    </>

                  )}
                </View>

                <TouchableOpacity style={styles.addContactButton} onPress={() => showAddContactModal()}>
                  <Text>Add Contact</Text>
                </TouchableOpacity>


              </View>
            )}


            {/* Update Contact Modal */}
            <Modal
              transparent={true}
              visible={modalVisible}
              animationType="slide"
              onRequestClose={closeModal}
            >
              <View style={styles.modalContainer}>
                <View>
                  {/* Modal Content */}
                  <Text style={styles.modalText}>Update or Remove Contact</Text>

                  {/* Input for Updating Contact */}
                  <TextInput
                    style={styles.input}
                    placeholder="Enter updated contact"
                    placeholderTextColor="#FFFFFF"
                    onChangeText={(text) => setUpdatedContact(text)}
                  />

                  {/* Input for Removing Contact */}
                  <TextInput
                    style={styles.input}
                    placeholder="Enter contact to remove"
                    placeholderTextColor="#FFFFFF"
                    onChangeText={(text) => setRemovedContact(text)}
                  />

                  {/* Update and Remove Contact Buttons */}
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdateContact}
                  >
                    <Text style={styles.buttonText}>UPDATE CONTACT</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={handleRemoveContact}
                  >
                    <Text style={styles.buttonText}>REMOVE CONTACT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Login Form Modal */}
            <Modal
              transparent={true}
              visible={isLoginModalVisible}
              animationType="slide"
              onRequestClose={() => setLoginModalVisible(true)}

            >
              <View style={styles.modalContainer}>
                {/* <View style={styles.card}> */}
                <LoginScreen
                  modalVisible={isLoginModalVisible}
                  closeModal={() => hideLoginModal()}
                  openRegister={() => showSignupModal()}
                  onForgotPass={showForgotPassModal}
                // style={{width: 10,margin: 10,}}
                />
              </View>
              {/* </View> */}
            </Modal>

            {/* Registration Form Modal */}
            <Modal
              transparent={true}
              visible={isSignupModalVisible}
              animationType="slide"
              onRequestClose={hideSignupModal}
            >
              <View style={styles.modalContainer}>
                <RegistrationScreen
                  closeModal={() => hideSignupModal()}
                  onLogin={() => showLoginModal()}
                />
              </View>
            </Modal>
            {/* forgot password Form Modal */}
            <Modal
              transparent={true}
              visible={isForgotPassModalVisible}
              animationType="slide"
              onRequestClose={hideForgotPassModal}
            >
              <View style={styles.modalContainer}>
                <ForgotPassword
                  closePasswordResetModal={() => hideForgotPassModal()}
                />
              </View>
            </Modal>

            {/* Edit/ Update Contacts Modal */}
            <Modal
              transparent={true}
              visible={isUpdateModalVisible}
              animationType="slide"
              onRequestClose={hideUpdateModal}
            >
              <View style={styles.overlay} />
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => setUpdateModalVisible(false)}>
                  <FontAwesome name="times" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.modalCard}>
                  <Text style={styles.trustedContact}>Edit Contact</Text>
                  <View>
                    {modalData && (
                      <View>
                        <InputText
                          ref={nameUpdateRef}
                          style={styles.input}
                          placeholder="Name"
                          value={modalData.name}
                          onChangeText={(text) => {
                            setModalData({
                              ...modalData,
                              name: text,
                            })
                          }}
                          onSubmitEditing={() => phoneUpdateRef.current.focus()}
                          returnKeyType="next"
                        />
                        <InputText
                          ref={phoneUpdateRef}
                          style={styles.input}
                          placeholder="Phone Number"
                          value={modalData.phoneNumber}
                          onChangeText={(text) =>
                            setModalData({
                              ...modalData,
                              phoneNumber: text,
                            })
                          }
                          onSubmitEditing={() => relationshipUpdateRef.current.focus()}
                          returnKeyType="next"
                        />
                        <InputText
                          ref={relationshipUpdateRef}
                          style={styles.input}
                          placeholder="Relationship"
                          value={modalData.relationship}
                          onChangeText={(text) =>
                            setModalData({
                              ...modalData,
                              relationship: text,
                            })
                          }
                          returnKeyType="done"
                        />
                        {/* list available contacts */}
                        <ScrollView
                          contentContainerStyle={{
                            flexGrow: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            // paddingHorizontal: 20,
                            marginVertical: 10,
                          }}
                          horizontal={true}
                          bounces={true}
                          showsHorizontalScrollIndicator={false}
                        >
                          <View style={styles.chipsGroup}>
                            {contacts ? (
                              contacts.map((contact, index) => (
                                <TouchableOpacity key={index}>
                                  <ChipButton
                                    key={index}
                                    title={contact.name}
                                    onPress={() => selectContactForUpdate(contact)}
                                    style={{
                                      backgroundColor:
                                        selectedContact?.id === contact.id
                                          ? "lightgray"
                                          : "transparent",
                                    }}
                                  />
                                </TouchableOpacity>
                              ))
                            ) : (
                              <Text>No contacts available</Text>
                            )}
                          </View>
                        </ScrollView>


                        <TouchableOpacity style={styles.addContactButton} onPress={() => handleUpdateContact()}>

                          {loadingUpdate?(<ActivityIndicator size={30} color="black" />):(<Text>Update</Text>)}
                          
                          
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Modal>

            {/* Add Contact Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isAddContactModalVisible}
              onRequestClose={hideAddContactModal}
            >
              <View style={styles.overlay} />
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => setAddContactModalVisible(false)}>
                  <FontAwesome name="times" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.modalCard}>
                  <Text style={styles.trustedContact}>Add New Contact</Text>
                  <View style={styles.inputContainer}>
                    <InputText
                      label={"Name"}
                      placeholder="Name"
                      autoFocus
                      value={newContactData.name}
                      onChangeText={(text) =>
                        setNewContactData({ ...newContactData, name: text })
                      }
                      style={styles.input}
                    />
                    {nameError && <Text style={styles.errorText}>{nameError}</Text>}
                  </View>

                  <View style={styles.inputContainer}>
                    <PhoneInput
                      ref={phoneInput}
                      defaultValue={phone}
                      defaultCode="ZA"
                      layout="first"
                      onChangeFormattedText={(text) => {
                        validatePhoneNumber(text);
                        setPhone(text);
                      }}
                      withShadow

                    />
                    {phoneError ? <Text style={{ color: 'red' }}>{phoneError}</Text> : null}
                  </View>

                  <View style={styles.inputContainer}>
                    <InputText
                      label={"Relationship"}
                      placeholder="Relationship"
                      value={newContactData.relationship}
                      onChangeText={(text) =>
                        setNewContactData({ ...newContactData, relationship: text })
                      }
                      style={styles.input}
                    />
                    {relationshipError && (
                      <Text style={styles.errorText}>{relationshipError}</Text>
                    )}
                  </View>

                  <TouchableOpacity style={styles.addContactButton} onPress={handleAddContact}>
                    {loadingAdd? (<ActivityIndicator size="small" color="black" />):(<Text>Add Contact</Text>)}
                    
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>


            {/* View Contacts Pseudo Bottom Sheet */}
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              backgroundStyle={{ borderRadius: 50, backgroundColor: '#002E15' }}
              onDismiss={() => setOpenContact(false)}
            >
              <View style={styles.contentContainer}>

                {modalData && (
                  <View style={{ margin: 20 }}>
                    <View style={{ alignContent: 'center', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>{modalData.name}</Text>
                      <Text style={{ color: 'white' }}>{modalData.phoneNumber}</Text>
                    </View>

                    <TouchableOpacity style={{ marginVertical: 6, borderBottomColor: '#6A8776', padding: 10, borderBottomWidth: 1 }} onPress={showUpdateModal} ><Text style={{ color: 'white' }}>Update contact</Text></TouchableOpacity>

                    <TouchableOpacity style={{ marginVertical: 6, borderBottomColor: '#6A8776', padding: 10, borderBottomWidth: 1 }} onPress={() => handleRemoveContact(modalData.id)}><Text style={{ color: 'red' }}>Remove Contact</Text></TouchableOpacity>
                  </View>
                )}

              </View>
            </BottomSheetModal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isViewContactModalVisible}
              onRequestClose={hideViewContactModal}
            >
              <View style={styles.bottomSheet2}>
                <View style={styles.contactCard}>
                  <View style={styles.container}>
                    <View style={styles.contactList}>
                      {selectedContact ? (
                        <View style={styles.textContent}>
                          {/* <Text style={styles.title}>Trusted Contacts</Text> */}
                          <Text style={styles.trustedContact}>
                            {selectedContact.name}
                          </Text>
                          <Text style={styles.textContent}>
                            {selectedContact.phoneNumber}
                          </Text>
                          <View>
                            <Button2
                              title="Update Contact"
                              onPress={showUpdateModal}
                              altText="Update Contact"
                              textColor={"#f2f2f2"}
                            />
                            <Button2
                              title="Remove Contact"
                              onPress={() => handleRemoveContact(selectedContact.id)}
                              altText="Remove Contact"
                              textColor={"#ff2323"}
                            />
                          </View>
                        </View>
                      ) : (
                        <Text style={{ color: "#ff2323", textAlign: "center" }}>
                          No contact selected
                        </Text>
                      )}
                    </View>
                    <Text>
                      <Text>{"\n"}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </Modal>

          </View>

        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RootSiblingParent>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#125127',
    width: '95%',
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: 5,
    // height:'40%'
  },
  bottomSheet2: {
    zIndex: 1,
    display: "flex",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
    borderRadius: 25,
    gap: 20,
    backgroundColor: "#002E15",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    textAlign: "center",
    bottom: 0,
    position: "absolute",
    height: "25%",
    width: "100%",
    // for the shadows at the top
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 4,
  },
  contactCard: {
    gap: 10,
    display: "flex",
    alignSelf: "stretch",
    // flexDirection: "column",
    justifyContent: "center",
  },
  contactList: {
    width: "100%",
    display: "flex",
    alignSelf: "stretch",
    // flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 4,
    rowGap: 6,
    gap: 10,
  },
  card: {
    width: "70%", // Fill (393px)
    padding: 30,
    borderRadius: 20,
    gap: 20,
    flex: 1,
    margin: 30,
  },
  trustedContact: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "center",
    color: "#FFFFFF", // White text color
  },
  additionalText: {
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "400",
    lineHeight: 18,
    letterSpacing: 0.16,
    textAlign: "center",
    marginTop: -20,
    color: "#FFFFFF", // White text color
  },
  paragraph: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: 0.16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  addButton: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 5,
      },
    }),
    width: "100%",
    height: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#C8FFD7",
    marginTop: -10,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.46,
    textAlign: "center",
    color: "#000000",
    marginTop: -10,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
  },
  modalCard: {
    width: "100%", // Fill (393px)
    padding: 30,
    borderRadius: 20,
    gap: 20,
    backgroundColor: "#002E15",
    marginBottom: 20,
  },
  modalText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#FFFFFF",
  },
  phoneInputContainer: {
    width: '100%',
    borderColor: "#0CB218",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  phoneInputText: {
    color: "black",
    height: 20,


  },
  buttonGroup: {
    width: "100%",
    flexDirection: "column",
    // flexWrap: "wrap",
    alignItems: "left",
    gap: 8,
    justifyContent: "flex-end",
    color: "#f2f2f2",
    marginTop: 24,
  },
  updateButton: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 5,
      },
    }),
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#C8FFD7",
    marginBottom: 10,
  },
  removeButton: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 5,
      },
    }),
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FF4040",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.46,
    textAlign: "center",
    color: "#000000",
  },
  closeButton: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#C8FFD7",
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.46,
    textAlign: "center",
    color: "#000000",
  },
  noUserText: {
    letterSpacing: 0.16,
    letterSpacing: 0.16,
    color: 'white',
    fontSize: 13,
    textAlign: 'center'
  },
  // imported styles from Splash
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "column",
    // paddingHorizontal: 20,
  },
  bottom: {
    bottom: 0,
    // backgroundColor: "#062817",
  },
  chipsGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    rowGap: 6,
  },
  logoImg: {
    width: 82,
    height: 24,
    resizeMode: 'cover'
  },
  addContactButton: {
    borderRadius: 40,
    backgroundColor: "#C8FFD7",
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    margin: 10,

  },
  BgImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    // marginVertical: 20,
  },
  signalImg: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    // marging: 16,
    marginVertical: 20,
  },
  textContent: {
    // paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "left",
    gap: 20,
    color: "#f2f2f2",
    flexWrap: "wrap",
  },
  title: {
    fontWeight: "700",
    letterSpacing: 0.5,
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    marginBottom: 16,
    // marginTop:

  },
  text: {
    // fontSize: 14,
    fontWeight: "normal",
    // marginVertical: 5,
    textAlign: "center",
    paddingHorizontal: 12,
    color: 'gray'
  },
  buttonSection: {
    width: "100%",
    height: "auto",
    position: "relative",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 40,
  },
  bgGreen: {
    backgroundColor: "green",
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#125127",
    height: "30%",
    width: "100%",
    // flex:1,
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  bottomSheet2: {
    zIndex: 1,
    display: "flex",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 30,
    borderRadius: 25,
    gap: 20,
    backgroundColor: "#002E15",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    textAlign: "center",
    bottom: 0,
    position: "absolute",
    height: "25%",
    width: "100%",
    // for the shadows at the top
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 4,
  },
  profileicon: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  contacts: {
    // display: 'flex',
    // flexDirection: 'row',
    margin: 5,
    // flexWrap: 'wrap'
  },
  chip: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,

  },
  name: {
    color: 'white',
    fontSize: 13
  },
  closeIcon: {
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    justifyContent: "flex-end",
    margin: 8,
    height: 48,

  },
});

export default LandingScreen;