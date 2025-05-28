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
    const [isDisabled, setIsDisabled] = React.useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);


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
        input.length > 0 ? setIsDisabled(false) : setIsDisabled(true); // Enable button only if input is not empty
    }; 

    const handleSubmit = (menuInputText: string, emailInputText: string, checked: boolean) => {
      setIsSubmitted(true);
      onSubmit(menuInputText, emailInputText, checked);
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
                      <Text style={styles.mainMessage}>We haven't been here before! Help us out by providing the URL to the restaurant's menu.
                        This might take a few minutes, come back later for the results or provide your email so we can notify you when the results are ready!</Text>

                      <div id="menu-input-panel" style={styles.inputSection}>

                        <Text style={styles.panelHeader}>Provide the URL to the menu.</Text>
                    
                        <SafeAreaProvider>
                          <SafeAreaView
                              style={styles.container}    
                          >
                              <TextInput
                                  editable
                                  multiline
                                  style={styles.checkboxText}
                                  onChangeText={input => handleMenuInputChange(input)}
                                  value={menuInputText}
                                  placeholder="Enter Menu URL"
                                  keyboardType="numeric"
                              />
                          </SafeAreaView>
                        </SafeAreaProvider>
                      </div>

                      <div id="email-input-panel" style={styles.inputSection}>
                        <Text style={styles.panelHeader}>Provide email.</Text>
                      
                        <SafeAreaProvider>
                          <SafeAreaView
                              style={styles.container}    
                          >
                              <TextInput
                                  editable
                                  multiline
                                  style={styles.checkboxText}
                                  onChangeText={input => setEmailInputText(input)}
                                  value={emailInputText}
                                  placeholder="Enter email"
                                  keyboardType="numeric"
                              />
                          </SafeAreaView>
                        </SafeAreaProvider>
                        <Checkbox
                          status={checked ? 'checked' : 'unchecked'}
                          onPress={() => setChecked(!checked)}
                        />
                        <Text onPress={() => setChecked(!checked)}>Sign up for our interest list.</Text>
                      </div>

                      <Button disabled={isDisabled} onPress={() => handleSubmit(menuInputText, emailInputText, checked)} title="Submit">
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
  }
});


export default MenuInputComponent;