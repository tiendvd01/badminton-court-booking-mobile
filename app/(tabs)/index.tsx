import FavoriteButton from '@/components/FavoriteButton';
import SearchBox from '@/components/SearchBox';
import { Image } from 'expo-image';
import React from 'react'
import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native';

function DashboardScreen() {
  return (
    <View>
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
          <Image 
              style={styles.avatar}
              source={require("../../assets/images/shuttlecock_new_bg.png")}
            />
          <View style={styles.infoWrapper}>
            <Text style={styles.date}>Thứ bảy, 22/03/2025</Text>
            <Text style={styles.name}>Đoàn Văn Duy Tiến</Text>
          </View>
        </View>
        <View style={styles.searchBoxWrapper}>
          <View style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}>
            <View style={{ flex: 1 }}>
              <SearchBox />
            </View>
            <FavoriteButton />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#3F7D58",
    paddingHorizontal: 16,
    height: 140,
    position: "relative",
    display: "flex",
    justifyContent: "flex-end"
  },
  searchBoxWrapper: {
    zIndex: 3,
    position: "absolute",
    bottom: -20,
    left: 16,
    right: 16,
  },
  headerContent: {
    marginBottom: 30,
    display: "flex",
    flexDirection: "row",
    gap: 16
  },
  avatar: {
    borderRadius: 100,
    width: 56,
    height: 56,
  },
  infoWrapper: {
    display: "flex",
    gap: 4,
    paddingVertical: 4,
    justifyContent: "space-between"
  },
  date: {
    color: "#fff",
    fontSize: 14
  },
  name: {
    color: "#EF9651",
    fontSize: 18,
    fontWeight: "bold"
  }
})

export default DashboardScreen;