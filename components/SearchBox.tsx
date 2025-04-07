import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

function SearchBox() {
  return (
    <View style={styles.container}><TextInput  style={styles.textInput} placeholder='' /></View>
  )
}

const styles = StyleSheet.create({
    container: {
        boxShadow: '0px 4px 4px 0px rgba(112, 37, 37, 0.25)',
        borderRadius: 12,
        minHeight: 40,
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        position: "relative",
    },
    textInput: {
        height: "100%"
    },
    icon: {
        position: "absolute",
        right: 16,
        top: 8,
    },
})

export default SearchBox