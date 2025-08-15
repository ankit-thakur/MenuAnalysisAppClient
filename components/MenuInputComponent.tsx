import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  Easing,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import { Checkbox } from 'expo-checkbox';
import { Button } from "react-native-elements";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


interface MenuInputProps {
  onShowMenuInput: (showInput: boolean) => void;
  onSubmit: (menuInput: string, emailInput: string, addToList: boolean) => void;
}

const MenuInputComponent: React.FC<MenuInputProps> = ({ onShowMenuInput, onSubmit }) => {

  // console.log("MenuInputComponent rendered with showInput:", showInput);

  const [panelVisible, setPanelVisible] = useState<boolean>(false);
  const [menuInputText, setMenuInputText] = useState('');
  const [emailInputText, setEmailInputText] = useState('');
  const [isChecked, setIsChecked] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMenuInputError, setShowMenuInputError] = useState(false);  
  const [showEmailInputError, setShowEmailInputError] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);


  const slideAnim = useRef(new Animated.Value(0)).current; // Initialize slide animation value
  // opens MenuInput panel once on component mount
  useEffect(() => {
      openPanel();
      console.log("MenuInputComponent mounted, opening panel");
      // setPanelVisible(true);
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: panelVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [panelVisible, keyboardHeight]);

  const openPanel = () => {
    setPanelVisible(true);
    Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
    }).start(() => {
      onShowMenuInput(true);
      setPanelVisible(true);
    });
  };
  
  const closePanel = () => {
    Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.exp),
        useNativeDriver: true,
    }).start(() => {
      onShowMenuInput(false);
      setPanelVisible(false);
    });
  };
  
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [520, -keyboardHeight], // Shift up when keyboard is open
  });

  const handleMenuInputChange = (input: string) => {
    setMenuInputText(input);
  };

  const handleEmailInputChange = (input: string) => {
    setEmailInputText(input);
  };

  const handleSubmit = (menuInputText: string, emailInputText: string, checked: boolean) => {
    if (!showMenuInputError && !showEmailInputError && menuInputText) {
      console.log("Menu URL and email are valid. Submitting...");
      setIsSubmitted(true);
      onSubmit(menuInputText, emailInputText, checked);
    }
  }

  const isValidHtmlOrPdfUrl = () => {
    setShowMenuInputError(false);
    try {
      const parsedUrl = new URL(menuInputText);

      // Ensure the protocol is HTTP or HTTPS
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        setShowMenuInputError(true);
      }

      // Extract file extension from pathname
      const pathname = parsedUrl.pathname.toLowerCase();

      if (pathname.endsWith('.pdf') || pathname.endsWith('.html') || pathname.endsWith('.htm')) {
        setShowMenuInputError(true);
      }
    } catch (e) {
      setShowMenuInputError(true);
    }
  }

  const isValidEmail = () => {
    setShowEmailInputError(false);

    if (!emailInputText || emailInputText.trim() === '') {
      setShowEmailInputError(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInputText.toLowerCase())) {
      setShowEmailInputError(true);
    }
  }

  const isSubmitDisabled = () => {
    if (showMenuInputError || showEmailInputError || !menuInputText) {
      return true; // Disable button if there are errors or inputs are empty
    }
    return false; // Enable button if no errors and inputs are valid
  }


  return(
    <View style={styles.container}>
      <Modal transparent visible={panelVisible} animationType="fade">
        <Pressable style={styles.overlay} onPress={closePanel} />
        <Animated.View style={[styles.panel, { transform: [{ translateY }] }]}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 35 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === 'ios' ? 20 : 80}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View>
                  {!isSubmitted ? (
                  <>
                    <Text style={styles.mainMessage}>We haven't tried this place yet!</Text>

                    <View style={styles.inputSection}>

                      <Text style={styles.inputHeader}>Help us out by providing the URL to the restaurant's menu:</Text>
                      <View>
                        {showMenuInputError && (
                          <Text style={styles.inputError}>
                            Menu URL format is invalid. Please try again.
                          </Text>
                        )}
                    
                        <SafeAreaProvider>
                          <SafeAreaView
                              style={styles.container}    
                          >
                              <TextInput
                                  editable
                                  multiline
                                  style={styles.inputText}
                                  onChangeText={input => handleMenuInputChange(input)}
                                  onBlur={() => isValidHtmlOrPdfUrl()}
                                  value={menuInputText}
                                  placeholder="Enter Menu URL"
                                  placeholderTextColor="#808080"
                              />
                          </SafeAreaView>
                        </SafeAreaProvider>
                      </View>
                    </View>

                    <View style={styles.inputSection}>
                      <Text style={styles.inputHeader}>This might take a few minutes, come back later for the results or provide your email so we can notify you when the results are ready!</Text>
                  
                      <View>
                        {showEmailInputError && (
                          <Text style={styles.inputError}>
                            Email format is invalid. Please try again.
                          </Text>
                        )}
                        <SafeAreaProvider>
                          <SafeAreaView
                              style={styles.container}    
                          >
                              <TextInput
                                  editable
                                  multiline
                                  style={styles.inputText}
                                  onChangeText={input => handleEmailInputChange(input)}
                                  onBlur={() => isValidEmail()}
                                  value={emailInputText}
                                  placeholder="Enter email"
                                  placeholderTextColor="#808080"
                              />
                          </SafeAreaView>
                        </SafeAreaProvider>
                      </View>
                    </View>

                    <View style={styles.checkboxSection}>
                      <Checkbox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? '#4d7f38' : undefined}
                      />
                      <Text onPress={() => setIsChecked(!isChecked)}>Sign up for our interest list</Text>
                    </View>

                    <Button disabled={isSubmitDisabled()} onPress={() => handleSubmit(menuInputText, emailInputText, isChecked)} title="Submit">
                      <Text>Submit</Text>
                    </Button>
                  </>
                ) : (
                  <>
                    <Text style={styles.mainMessage}>Thanks for your input! We'll email you when the results are ready. Feel free to continue browsing!</Text>
                    <Button onPress={closePanel} title="Close">
                      <Text>Close</Text>
                    </Button>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>      
        </Animated.View>
      </Modal>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    marginRight: 10,
    flex: 1
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  buttonText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  panelHeader: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  checkboxText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  arrow: {
    marginLeft: 5,
  },
  inputSection: {
    margin: 10,
  },
  mainMessage: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  inputHeader: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginBottom: 6,
  },
  inputText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    padding: 6,
    height: 45,
    width: '100%', // ensures it expands inside parent
  },
  inputError: {
    color: 'red',
    fontSize: 12,
  },
  checkboxSection: {
    flexDirection: 'row',   // same as 'flex-direction: row'
    alignItems: 'center',
    marginTop: 0,    // top margin
    marginBottom: 20, // bottom margin
    marginLeft: 10,   // left margin
    marginRight: 10,  // right margin
    gap: 10,
  }
});


export default MenuInputComponent;