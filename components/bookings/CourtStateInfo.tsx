import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CourtStateInfoProps {
  containerStyle?: object;
  itemStyle?: object;
  textStyle?: object;
}

const CourtStateInfo: React.FC<CourtStateInfoProps> = ({ 
  containerStyle = {},
  itemStyle = {},
  textStyle = {} 
}) => {
  const states = [
    { 
      id: 'available', 
      label: 'Trống', 
      color: '#FFFFFF',
      borderColor: '#4CAF50'
    },
    { 
      id: 'booked', 
      label: 'Đã đặt', 
      color: '#FF6B6B',
      borderColor: '#FF6B6B'
    },
    { 
      id: 'locked', 
      label: 'Khóa', 
      color: '#9E9E9E',
      borderColor: '#9E9E9E'
    }
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {states.map((state) => (
        <View key={state.id} style={[styles.stateItem, itemStyle]}>
          <View 
            style={[
              styles.colorBox, 
              { 
                backgroundColor: state.color,
                borderColor: state.borderColor
              }
            ]} 
          />
          <Text style={[styles.stateText, textStyle]}>{state.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 3,
    borderWidth: 1,
    marginRight: 6,
  },
  stateText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});

export default CourtStateInfo;