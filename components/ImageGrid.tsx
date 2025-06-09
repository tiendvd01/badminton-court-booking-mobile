import React, { useState } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, Modal } from 'react-native';

interface ImageGridProps {
  imageUrls: Array<{
    id: string;
    image_url: string;
  }>;
  onImagePress?: (imageUrl: string) => void;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 32 - 16) / 3; // 32 for padding, 16 for gap

const ImageGrid: React.FC<ImageGridProps> = ({ imageUrls, onImagePress }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handlePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    onImagePress?.(imageUrl);
  };

  const renderItem = ({ item }: { item: { id: string; image_url: string } }) => (
    <TouchableOpacity 
      style={styles.imageContainer}
      onPress={() => handlePress(item.image_url)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image_url }} 
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={imageUrls}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
      {selectedImage && (
        <Modal
          visible={true}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}
        >
          <TouchableOpacity style={styles.modalBackground} onPress={() => setSelectedImage(null)}>
            <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} resizeMode="contain" />
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  grid: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '90%',
  },
});

export default ImageGrid;