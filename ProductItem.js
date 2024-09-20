import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import 'react-native-gesture-handler';

const ProductItem = ({ product, onPress, onAddToCart }) => {

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Image source={{uri: product.hinhAnh}} style={styles.image} />
        <Text style={styles.name} numberOfLines={2}>{product.tenSach}</Text>
        <Text style={styles.price}>{VND.format(product.giaTien)}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onAddToCart} style={styles.addButton}>
        <Text style={styles.addButtonText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 4,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
    padding: 5,
    alignItems: "center",
  },
  image: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 150,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden'
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    overflow: 'hidden',
    marginLeft: 5,
    marginRight: 5,
  },
  price: {
    fontSize: 16,
    color: "red",
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#ff6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProductItem;
