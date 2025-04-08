import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import SearchIcon from './icons/SearchIcon';

function SearchBox() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Tìm kiếm"
        placeholderTextColor="#A0A0A0"
      />
      <View style={styles.icon}>
        <SearchIcon size={20} color="#A0A0A0" />
      </View>
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
  },
  icon: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBox;