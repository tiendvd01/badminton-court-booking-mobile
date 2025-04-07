import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type InputType = 'normal' | 'password';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  type?: InputType;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  errorMessage,
  type = 'normal',
  style,
  autoCapitalize = 'sentences',
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(true);
  const [isSecure, setIsSecure] = useState(type === 'password');

  const isPassword = type === 'password';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          errorMessage && styles.inputInvalid,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={isSecure}
          placeholderTextColor="#aaa"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={autoCapitalize}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(prev => !prev)}>
            <Ionicons
              name={isSecure ? 'eye-off' : 'eye'}
              size={22}
              color="#777"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: '#a0a0a0',
  },
  inputInvalid: {
    borderColor: '#ff5a5f',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
  },
  icon: {
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
    color: '#ff5a5f',
    fontSize: 14,
  },
});

export default AppTextInput;
