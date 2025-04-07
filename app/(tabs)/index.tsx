import SearchBox from '@/components/SearchBox';
import React from 'react'
import { StyleSheet } from 'react-native';
import { View } from 'react-native';

function DashboardScreen() {
  return (
    <View>
      <View style={styles.headerWrapper}>
        <View style={styles.searchBoxWrapper}><SearchBox /></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#3F7D58",
    paddingHorizontal: 16,
    paddingBottom: 30,
    height: 130,
    position: "relative",
  },
  searchBoxWrapper: {
    zIndex: 3,
    position: "absolute",
    bottom: -20,
    left: 16,
    right: 16,
  }
})

export default DashboardScreen;