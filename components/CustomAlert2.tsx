import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

type AlertProps = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
};

const CustomAlert = ({ visible, title, message, onConfirm, onClose }: AlertProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonContainer}>
            {onConfirm && (
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]}
                onPress={onConfirm}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{onConfirm ? 'Cancelar' : 'Cerrar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
  },
  title: {
    fontFamily: 'mon-b',
    fontSize: 20,
    color: Colors.dark,
    marginBottom: 8,
  },
  message: {
    fontFamily: 'mon',
    fontSize: 16,
    color: Colors.grey,
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  closeButton: {
    backgroundColor: Colors.grey,
  },
  buttonText: {
    fontFamily: 'mon-sb',
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomAlert;