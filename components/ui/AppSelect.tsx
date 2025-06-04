
import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  SafeAreaView,
  Dimensions,
  Animated
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface SelectOption {
  value: string;
  label: string;
}

interface AppSelectProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
}

export default function AppSelect({
  options,
  placeholder = 'Select an option',
  value,
  onChange,
  label,
  disabled = false,
  error
}: AppSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const animatedRotation = useRef(new Animated.Value(0)).current;

  // Find the selected option label
  const selectedOption = options.find(option => option.value === value);
  
  const openModal = () => {
    if (disabled) return;
    setModalVisible(true);
    Animated.timing(animatedRotation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setModalVisible(false);
    Animated.timing(animatedRotation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    closeModal();
  };

  const spin = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>}
      
      <TouchableOpacity 
        style={[
          styles.selectButton,
          isDark && styles.selectButtonDark,
          disabled && styles.disabled,
          error && styles.errorBorder
        ]}
        onPress={openModal}
        disabled={disabled}
      >
        <Text 
          style={[
            styles.selectText,
            !selectedOption && styles.placeholder,
            isDark && styles.selectTextDark
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <IconSymbol 
            name="chevron.up" 
            size={16} 
            color={isDark ? '#999' : '#666'} 
          />
        </Animated.View>
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View 
              style={[
                styles.modalContent,
                isDark && styles.modalContentDark
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                  {placeholder}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <IconSymbol 
                    name="xmark" 
                    size={20} 
                    color={isDark ? '#fff' : '#000'} 
                  />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[
                      styles.optionItem,
                      item.value === value && styles.selectedOption,
                      isDark && item.value === value && styles.selectedOptionDark
                    ]} 
                    onPress={() => handleSelect(item)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        item.value === value && styles.selectedOptionText,
                        isDark && styles.optionTextDark
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <IconSymbol 
                        name="checkmark" 
                        size={18} 
                        color={isDark ? Colors.dark.tint : Colors.light.tint} 
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
  },
  labelDark: {
    color: '#eee',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  selectButtonDark: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  selectText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  selectTextDark: {
    color: '#fff',
  },
  placeholder: {
    color: '#999',
  },
  disabled: {
    opacity: 0.6,
  },
  errorBorder: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContentDark: {
    backgroundColor: '#222',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalTitleDark: {
    color: '#fff',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextDark: {
    color: '#eee',
  },
  selectedOption: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  selectedOptionDark: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
  },
  selectedOptionText: {
    color: Colors.light.tint,
    fontWeight: '500',
  },
});

