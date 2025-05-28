import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // for internal navigation

interface AlertOverlayProps {
  visible: boolean;
  onClose: () => void;
  externalLink?: string; // optional prop for an external link
  internalPage?: string; // optional prop for internal navigation
  errorMessage?: string; // optional prop to pass the error message
}

const AlertOverlay: React.FC<AlertOverlayProps> = ({ visible, onClose, externalLink, internalPage, errorMessage }) => {
  const navigation = useNavigation();

  const handleExternalLink = () => {
    if (externalLink) {
      Linking.openURL(externalLink).catch(() => {
        console.error('Failed to open external link');
      });
    }
  };

  const handleInternalNavigation = () => {
    if (internalPage) {
      navigation.navigate(internalPage as never);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>Error</Text>
          <Text style={styles.alertMessage}>{errorMessage || 'Something went wrong!'}</Text>
          
          <View style={styles.buttonContainer}>
            {/* Close button */}
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Dismiss</Text>
            </TouchableOpacity>

            {/* External Link Button */}
            {externalLink && (
              <TouchableOpacity onPress={handleExternalLink} style={styles.button}>
                <Text style={styles.buttonText}>Learn More</Text>
              </TouchableOpacity>
            )}

            {/* Internal Navigation Button */}
            {internalPage && (
              <TouchableOpacity onPress={handleInternalNavigation} style={styles.button}>
                <Text style={styles.buttonText}>Go to Help</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // semi-transparent black background
  },
  alertContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { height: 5, width: 0 },
    elevation: 5, // shadow for Android
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#4A90E2', // modern blue color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2, // slight elevation for button
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlertOverlay;
