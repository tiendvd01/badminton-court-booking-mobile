import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import SearchIcon from './icons/SearchIcon';

interface SearchBoxProps {
  onChange?: (value: string) => void;
  placeholder?: string;
}

function SearchBox({ onChange, placeholder = 'Tìm kiếm' }: SearchBoxProps) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (onChange && searchText.trim()) {
      onChange(searchText.trim());
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity 
        style={styles.icon} 
        onPress={handleSearch}
        activeOpacity={0.7}
      >
        <SearchIcon size={20} color="#A0A0A0" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    boxShadow: '0px 4px 4px 0px rgba(112, 37, 37, 0.25)',
    borderRadius: 10,
    minHeight: 40,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#000',
    paddingRight: 30, // Để tránh chữ bị đè lên icon
  },
  icon: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});

export default SearchBox;