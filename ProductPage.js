import React, { useEffect,useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Dimensions, ActivityIndicator, ScrollView} from 'react-native';
import { GestureHandlerRootView} from 'react-native-gesture-handler';

const ProductPage = ({ route, cartItems, onAddToCart, onUpdateCartItems }) => {
  const { product } = route.params;
  const [items, setItems] = useState(cartItems);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onUpdateCartItems(items);
  }, [items]);

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  return (
    <View style={styles.itemContainer}>
      <ScrollView style={styles.scrollableContent}>
        {/* Hình ảnh */}
      <TouchableOpacity  onPress={() => setModalVisible(true)}>
        <Image source={{ uri: product.hinhAnh }} style={[styles.image]} resizeMode="cover"/>
        <TouchableOpacity onPress={() => onAddToCart(product)} style={styles.addToCartButton}>
          <Text style={styles.addToCartButtonText}>Thêm Vào Giỏ Hàng</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <Image 
            source={{ uri: product.hinhAnh }} 
            style={styles.modalImage} 
            resizeMode="contain" 
          />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
          {/* Thông tin sách */}
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={2}>{product.tenSach}</Text>
        <View style={styles.column}>
          <Text style={styles.label}>Tác Giả:</Text>
          <Text style={styles.author}>{product.tacGia}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Giá Tiền:</Text>
          <Text style={styles.price}>{VND.format(product.giaTien)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Người Dịch:</Text>
          <Text style={styles.author}>{product.nguoiDich}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Nhà Xuất Bản:</Text>
          <Text style={styles.author}>{product.nxb}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Năm Xuất Bản:</Text>
          <Text style={styles.author}>{product.namXB}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Ngôn Ngữ:</Text>
          <Text style={styles.author}>{product.ngonNgu}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Trọng Lượng:</Text>
          <Text style={styles.author}>{product.trongLuong}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Kích Thước:</Text>
          <Text style={styles.author}>{product.kichThuoc}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Số Trang:</Text>
          <Text style={styles.author}>{product.soTrang}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Hình Thức:</Text>
          <Text style={styles.author}>{product.hinhThuc}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Mô Tả Sản Phẩm</Text>
        </View>
        <Text style={styles.description}>{product.moTaSanPham}</Text>
      </View>
      </ScrollView>
      
      
    </View>
    
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  scrollableContent:{
    flex: 1, // Allow scrollable content to take up remaining space
    marginTop: 10,
  },
  itemContainer: {
    flex:1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    
  },
  image: {
    marginTop: 5,
    width: 200,
    height: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 1,
    borderColor: '#fff',
    borderWidth: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: windowWidth,
    height: windowHeight,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addToCartButton: {
    width: 200,
    bottom: 0, // Điều chỉnh vị trí dưới của nút
    right: 0, // Điều chỉnh vị trí phải của nút
    backgroundColor: 'rgba(255, 69, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: -40,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textContainer:{
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  column: {
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'space-between'
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5,
    marginRight: 10,
    marginLeft: 10,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
  },
  price: {
    fontSize: 14,
    color: '#DC143C',
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
  },
});

export default ProductPage;
