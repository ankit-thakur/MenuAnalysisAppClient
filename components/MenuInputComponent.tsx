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
} from "react-native";
import { Checkbox } from 'react-native-paper';
import { Button } from "react-native-elements";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

interface MenuInputProps {
    onSubmit: (menuInput: string, emailInput: string, addToList: boolean) => void;
}

const MenuInputComponent: React.FC<MenuInputProps> = ({ onSubmit }) => {

  const [panelVisible, setPanelVisible] = useState(false);
  const [menuInputText, setMenuInputText] = useState('');
  const [emailInputText, setEmailInputText] = useState('');
  const [checked, setChecked] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMenuInputError, setShowMenuInputError] = useState(false);  const [showEmailInputError, setShowEmailInputError] = useState(false);


  const slideAnim = useRef(new Animated.Value(0)).current; // Initialize slide animation value

  // opens MenuInput panel once on component mount
  useEffect(() => {
      openPanel();
  }, []);


  const openPanel = () => {
      setPanelVisible(true);
      Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
      }).start();
  };
  
  const closePanel = () => {
      Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.exp),
          useNativeDriver: true,
      }).start(() => setPanelVisible(false));
  };
  
  const translateY = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [500, 0], // Slide up from 500px to 0px (fully visible)
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
          <Modal
              transparent={true}
              visible={panelVisible}
              animationType="fade"
              testID="filter-panel-modal"
          >
              <Pressable style={styles.overlay} onPress={closePanel} />
              <Animated.View style={[ styles.panel, { transform: [{ translateY }] } ]}>
                {!isSubmitted ? (
                  <>
                    <Text style={styles.mainMessage}>We haven't tried this place yet!</Text>

                    <div id="menu-input-panel" style={styles.inputSection}>

                      <Text style={styles.inputHeader}>Help us out by providing the URL to the restaurant's menu:</Text>
                      <div>
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
                                  keyboardType="numeric"
                              />
                          </SafeAreaView>
                        </SafeAreaProvider>
                      </div>
                    </div>

                    <div id="email-input-panel" style={styles.inputSection}>
                      <Text style={styles.inputHeader}>This might take a few minutes, come back later for the results or provide your email so we can notify you when the results are ready!</Text>
                  
                      <div>
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
                                  keyboardType="numeric"
                              />
                          </SafeAreaView>
                        </SafeAreaProvider>
                      </div>

                    </div>
                      
                    <div style={styles.checkboxSection}>
                      <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => setChecked(!checked)}
                      />
                      <Text onPress={() => setChecked(!checked)}>Sign up for our interest list</Text>
                    </div>

                    <Button disabled={isSubmitDisabled()} onPress={() => handleSubmit(menuInputText, emailInputText, checked)} title="Submit">
                      <Text>Submit</Text>
                    </Button>
                  </>
                ) : (
                  <>
                    <Text style={styles.mainMessage}>Thanks for your input! We'll notify you when the results are ready. Feel free to continue browsing!</Text>
                    <Button onPress={closePanel} title="Close">
                      <Text>Close</Text>
                    </Button>
                  </>
                )}
              </Animated.View>
          </Modal>
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    marginRight: 10,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 450,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    elevation: 10,
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
    margin: 20,
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
    padding: 6
  },
  inputError: {
    color: 'red',
    fontSize: 12,
  },
  checkboxSection: {
    display: "flex",
    alignItems: "center",
    marginTop: 0,    // top margin
    marginBottom: 20, // bottom margin
    marginLeft: 10,   // left margin
    marginRight: 10,  // right margin
  }
});


export default MenuInputComponent;