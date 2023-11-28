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
} from "react-native";
import ChipButton from "../components/ChipButton";
import {
  getContacts,
  addContact,
  updateContact,
  removeContact,
} from "../services/homeServices";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

import ShakeTrigger from "../services/ShakeTrigger";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Button2 from "../components/Button2";
import ShakeFeedback from "../components/ShakeFeedback";
import InputText from "../components/InputText";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

//
import { Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";
import { initializeAuthState } from "../services/homeServices";

import { ShakeEventExpo, sendSMS } from "../services/ShakeTrigger";
import getLocationPermission from "../services/geolocation";
import { Linking } from "react-native";
import * as Notifications from "expo-notifications";
import ForgotPassModal from "../components/ForgotPassModal";
import ForgotPassword from "./ForgotPassword";

const LandingScreen = ({ navigation, visible }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedContact, setUpdatedContact] = useState("");
  const [removedContact, setRemovedContact] = useState("");
  // from home scrip[t]
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddContactModalVisible, setAddContactModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [relationshipError, setRelationshipError] = useState(null);
  const [isShakeHandled, setIsShakeHandled] = useState(false);
  const [statusImageSource, setStatusImageSource] = useState(
    require("../../assets/Inactive.png")
  );
  const [location, setLocation] = useState(null);
  const [isShakeDetected, setIsShakeDetected] = useState(false);
  const [noSignedInUserErr, setNoSignedInUserErr] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [shakeStatusModalVisible, setShakeStatusModalVisible] = useState(false);
  const [enablePanDownToClose, setEnablePanDownToClose] = useState(true);
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
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [updatedContactData, setUpdatedContactData] = useState({
    name: "",
    phoneNumber: "",
    relationship: "",
  });
  useEffect(() => {
    initializeAuth();
    const shakeHandler = async () => {
      console.log("Shake detected!");
      const permissionResult = await getLocationPermission();

      if (permissionResult) {
        const newLocation = permissionResult.userLocation;
        setLocation(newLocation);
        setShakeStatusModalVisible(true);
        handleShake(true);
        sendSMS(
          "Emergency! I need help. My location: " +
          `https://www.google.com/maps/?q=${newLocation.latitude},${newLocation.longitude}`
        );
      }
    };

    ShakeEventExpo.addListener(shakeHandler);

    return () => {
      ShakeEventExpo.removeListener(shakeHandler);
    };
  }, [isShakeHandled]);

  const initializeAuth = async () => {
    const user = await initializeAuthState();

    if (user) {
      setCurrentUser(user);
      fetchContacts();
      console.log(" there is  user");
    } else {
      setContacts([]);
      console.log("Not logged in user");
    }
  };

  // Function to get user's contacts
  const fetchContacts = async () => {
    await getContacts(currentUser).then((data) => {
      console.log("contacts" > data);
      setContacts(data);
    });
  };
  const showContactDetails = (contact) => {
    setSelectedContact(contact);
    setUpdatedContactData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
    });
    // setConfirmationVisible(true)
    setViewContactModalVisible(true);
  };

  const showUpdateModal = () => {
    setUpdateModalVisible(true);
  };

  // from home
  const showAddContactModal = () => {
    // setNewContactData({
    //   name: "",
    //   phoneNumber: "",
    //   relationship: "",
    // });
    setAddContactModalVisible(true);
  };

  const hideAddContactModal = () => {
    setAddContactModalVisible(false);
  };


  const validatePhoneNumber = (phoneNumber) => {
    
    const formattedPhoneNumber = phoneNumber.startsWith("0")
      ? "27" + phoneNumber.slice(1)
      : phoneNumber;
  

    const phoneRegex = /^27[0-9]{9}$/;
  
    const isValid = phoneRegex.test(formattedPhoneNumber);
  
    setIsPhoneNumberValid(isValid);
  };
  
  
  const handleAddContact = async () => {
    try {
      if (!currentUser) {
        // Alert user to sign in or create an account to see the contact list
        Alert.alert(
          "Not Signed In",
          "Please sign in or register to add a contact.",
          [
            {
              text: "OK",
              onPress: () => {
                // Time the warning message before redirecting the user
                setTimeout(() => {
                  navigation.navigate("LandingPage"); //navigate to the screen where they can sign in
                }, 2000); // Delay for 2 seconds (2k is in milliseconds)
              },
            },
          ]
        );

        return;
      }

      if (!newContactData.name) {
        setNameError("Please enter Name");
        return;
      } else {
        setNameError(null);
      }

      if (!newContactData.phoneNumber) {
        setPhoneError("Please enter Phone number");
        return;
      } else {
        setPhoneError(null);
      }
      if (!isPhoneNumberValid) {
        setPhoneError("Invalid phone number. Please enter a valid South African number.");
        return;
      }else{
        
      }
  

      // Format phone number: if it starts with "0", add "27" to the beginning
      let formattedPhoneNumber = newContactData.phoneNumber;
      if (formattedPhoneNumber.startsWith("0")) {
        formattedPhoneNumber = "27" + formattedPhoneNumber.slice(1);
      }

      if (!newContactData.relationship) {
        setRelationshipError("Please enter Relationship");
        return;
      } else {
        setRelationshipError(null);
      }

      const contactWithUserId = {
        ...newContactData,
        phoneNumber: formattedPhoneNumber,
        userId: currentUser,
      };

      await addContact(contactWithUserId);
      fetchContacts();
      hideAddContactModal();
    } catch (error) {
      console.error("Error adding contact: ", error);
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

  const handleUpdateContact = () => {
    // Handle logic for updating contact with the value in updatedContact
    console.log(`Updating contact: ${updatedContact}`);
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
  const handleRemoveContact = () => {
    // Handle logic for removing contact with the value in removedContact
    console.log(`Removing contact: ${removedContact}`);
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
    setLoginModalVisible(false);
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
  const showViewContactModal = () => {
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
        // Show location modal
        setLocationModalVisible(true);

        sendNotification();

        // Set status image to main_icon.png for 5 seconds
        setStatusImageSource(require("../../assets/main_icon.png"));

        // Reset shake detection after 5 seconds
        setTimeout(() => {
          setIsShakeHandled(false); // Reset shake detection
          setStatusImageSource(require("../../assets/Inactive.png"));
        }, 5000);
      } else {
        setStatusImageSource(require("../../assets/Inactive.png"));
      }
    }
  };

  const sendNotification = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Emergency Alert",
          body: "This is an emergency alert",
        },
        trigger: null,
      });

      console.log("Notification scheduled: ", notificationId);
    } catch (error) {
      console.error("Error sending notification: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Backhground image */}
      <TouchableOpacity style={{ position: 'absolute', top: 40, right: 0 }} onPress={() => navigation.navigate('ProfileScreen')}>
        <Image source={require("../../assets/profile.png")} style={styles.profileicon} />
      </TouchableOpacity>
      <Image
        source={require("../../assets/Union.png")}
        style={styles.logoImg}
        accessibilityLabel="logo"
      />
      <Text>Your safety is just a shake away</Text>
      {/* Staus image */}

      <View style={styles.textContent}>
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
      </View>

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
          <Text style={styles.trustedContact}>Trusted Contact</Text>

          <View style={styles.contactCard}>
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <View style={styles.chipsGroup} >
                  <View key={index}>
                    <ChipButton
                      key={index}
                      title={contact.name}
                      onPress={showViewContactModal}
                    />
                  </View>
                </View>
              ))
            ) : (

              <View style={styles.contactList}>
                <Text style={styles.textContent}>YOUR EMERGENCY CONTACTS WILL APPEAR HERE.</Text>
                <Text style={styles.noUserText}>
                  You currently do not have any emergency contact. Import contacts or add new contacts
                </Text>

                {/* <TouchableOpacity style={styles.addContactButton} onPress={() => showAddContactModal()}>
                     <Text>Add Contact</Text>
                    </TouchableOpacity> */}
              </View>
            )}
            <View>

            </View>
          </View>
          <Button
            title={"Add Contact"}
            onPress={showAddContactModal}
            altText={"Add Contact"}
          />
        </View>
      )}

      {/* Main Activity contents Modals/screens/sheets | Outside the main content frame */}

      {/* view contact bottomsheet */}

      {/* Secondary Bottom Sheet  */}
      {/* <View style={styles.content}>
      <View style={styles.modalCard}>
          {selectedContact ? (
            <View style={styles.textContent}>
              <Text style={styles.title}>Trusted Contacts</Text>
              <Text style={styles.title}>{selectedContact.name}</Text>
              <Text style={styles.text}>{selectedContact.phoneNumber}</Text>
              <View style={styles.buttonGroup}>
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
            <Text style={{ color: "#ff2323", textAlign: "left" }}>
              No contact selected
            </Text>
          )}
          <TouchableOpacity onPress={hideConfirmation}>
            <Text style={styles.confirmTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View> */}

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

            {/* Close Modal Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>CLOSE</Text>
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
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <LoginScreen
              modalVisible={isLoginModalVisible}
              closeModal={() => hideLoginModal()}
              openRegister={() => showSignupModal()}
              onForgotPass={showForgotPassModal}
            // style={{width: 10,margin: 10,}}
            />
          </View>
        </View>
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
        <View style={styles.modalContainer}>
          <View style={styles.overlay}></View>
          <View style={styles.card}>
            <Text style={styles.title}>Edit Contact</Text>
            {selectedContact && (
              <View style={styles.textContent}>
                <InputText
                  style={styles.input}
                  placeholder="Name"
                  value={updatedContactData.name}
                  onChangeText={(text) =>
                    setUpdatedContactData({ ...updatedContactData, name: text })
                  }
                />
                <Text>{"\n"}</Text>
                <InputText
                  style={styles.input}
                  placeholder="Phone Number"
                  value={updatedContactData.phoneNumber}
                  onChangeText={(text) =>
                    setUpdatedContactData({
                      ...updatedContactData,
                      phoneNumber: text,
                    })
                  }
                />
                <Text>{"\n"}</Text>
                <InputText
                  style={styles.input}
                  placeholder="Relationship"
                  value={updatedContactData.relationship}
                  onChangeText={(text) =>
                    setUpdatedContactData({
                      ...updatedContactData,
                      relationship: text,
                    })
                  }
                />

                <Text>{"\n"}</Text>
                {/* list available contacts */}
                <ScrollView>
                  <View style={styles.contactList}>
                    {filteredContacts ? (
                      filteredContacts.map((contact, index) => (
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

                <View style={styles.buttonGroup}>
                  <Button
                    title="Update"
                    onPress={handleUpdateContact}
                    altText="Update Edit"
                  />
                </View>
              </View>
            )}
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
          <View style={styles.modalCard}>
            <Text style={styles.trustedContact}>Add New Contact</Text>
            <View>
              <InputText
                // style={styles.input}
                label={"Name"}
                placeholder="Name"
                value={newContactData.name}
                onChangeText={(text) =>
                  setNewContactData({ ...newContactData, name: text })
                }
              />

              {nameError && <Text style={styles.errorText}>{nameError}</Text>}
            </View>
            <View>
              <InputText
                label={"Number"}
                placeholder="0712345678"
                value={newContactData.phoneNumber}
                onChangeText={(text) =>
                  setNewContactData({ ...newContactData, phoneNumber: text })
                }
              />
              {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
            </View>

            <View>
              <InputText
                label={"Relationship"}
                placeholder="Relationship"
                value={newContactData.relationship}
                onChangeText={(text) =>
                  setNewContactData({ ...newContactData, relationship: text })
                }
              />
              {relationshipError && (
                <Text style={styles.errorText}>{relationshipError}</Text>
              )}
            </View>



            <View style={styles.buttonGroup}>
              <Button
                title="Add Contact"
                onPress={handleAddContact}
                altText="Add Contact"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* View Contacts Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isViewContactModalVisible}
        onRequestClose={hideViewContactModal}
      >
        <View style={styles.bottomSheet2}>
          <View style={styles.container}>
            <View style={styles.contactList}>
              {selectedContact && (
                <View style={styles.textContent}>
                  <InputText
                    style={styles.input}
                    placeholder="Name"
                    value={updatedContactData.name}
                    onChangeText={(text) =>
                      setUpdatedContactData({ ...updatedContactData, name: text })
                    }
                  />
                  <Text>{"\n"}</Text>
                  <InputText
                    style={styles.input}
                    placeholder="Phone Number"
                    value={updatedContactData.phoneNumber}
                    onChangeText={(text) =>
                      setUpdatedContactData({
                        ...updatedContactData,
                        phoneNumber: text,
                      })
                    }
                  />
                  <Text>{"\n"}</Text>
                  <InputText
                    style={styles.input}
                    placeholder="Relationship"
                    value={updatedContactData.relationship}
                    onChangeText={(text) =>
                      setUpdatedContactData({
                        ...updatedContactData,
                        relationship: text,
                      })
                    }
                  />

                  <Text>{"\n"}</Text>
                  {/* list available contacts */}
                  <ScrollView>
                    <View style={styles.contactList}>
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

                  <View style={styles.buttonGroup}>
                    <Button
                      title="Update"
                      onPress={handleUpdateContact}
                      altText="Update Edit"
                    />
                  </View>
                </View>
              )}
            </View>
            <Text>
              <Text>{"\n"}</Text>
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // content: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'flex-end',
  //   padding: 40, // Adjust as needed
  // },
  bottomSheet: {
    width: "100%",
    display: "flex",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 30,
    borderRadius: 25,
    gap: 20,
    backgroundColor: "#125127",
    // alignItems: "flex-start",
    justifyContent: "center",
    textAlign: "center",
    // for the shadows at the top
    shadowColor: "#0000005a",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 4,
    flexDirection: "column",

    // wrap text contents
    wordWrap: "break-word",
    flexWrap: "wrap",
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
    height: "20%",
    width: "100%",
    // for the shadows at the top
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 4,
  },
  contactCard: {
    // gap: 20,
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
    fontFamily: "Plus Jakarta Sans",
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
  input: {
    height: 40,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#FFFFFF",
    marginBottom: 20,
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
    color: "white",
    // fontSize: 13,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    wordWrap: "break-word",
    flexWrap: "wrap",
  },
  // imported styles from Splash
  container: {
    flex: 1,
    // backgroundColor: "#fff",
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

    display: "flex",
    alignSelf: "stretch",
    flexDirection: "row",

    alignItems: "center",
    columnGap: 4,
    rowGap: 6,
  },
  logoImg: {
    // flex: 1,
    width: 100,
    height: 24,
    marginTop: 24,
    resizeMode: "contain",
    // marginVertical: 20,
  },
  addContactButton: {
    borderRadius: 40,
    backgroundColor: "#C8FFD7",
    alignItems: "center",
    height: 42,
    width: "100%",
    justifyContent: "center",
    margin: 10,
  },
  BgImage: {
    width: 180,
    height: 200,
    // marginTop: -140,
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
    paddingHorizontal: 0,
    wordWrap: "break-word",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "left",
    gap: 20,
    color: "#f2f2f2",
    wordWrap: "break-word",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    // color: "#f2f2f2",
  },
  text: {
    // fontSize: 14,
    fontWeight: "normal",
    marginVertical: 5,
    textAlign: "center",
    paddingHorizontal: 12,
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
    marginTop: 10
  },







})

export default LandingScreen;
