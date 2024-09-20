import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Checkout = ({ route,  onDeleteCartItems }) => {
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const { email, items, total } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`http://192.168.45.162:55571/TaiKhoan/GetAllAddressByUser?email=${email}`)
        .then(response => {
            setAddress(response.data);
            setSelectedAddress(response.data[0]); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleCheckout = async() => {
    const newItems = items.map(({ maSach, quantity }) => ({ maSach, quantity }));
    const updatedItems = newItems.map((item) => {
        const newItem = { ...item };
        newItem.soLuong = item.quantity;
        delete newItem.quantity;
        return newItem;
        
    });
    const updatedItemsString = JSON.stringify(updatedItems);
    const dateObject = new Date();
    const formatter = new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const dateString = formatter.format(dateObject);
      const totalInt = parseInt(total, 10);
      const maDiaChiInt = parseInt(selectedAddress.maDiaChi, 10);
      try {
        const response = await axios.post('http://192.168.45.162:55571/DonHang/CreateOrder', {
          email: email,
          maDiaChi: maDiaChiInt,
          ngay: dateString,
          tongTien: totalInt,
          dscthd: updatedItemsString,
        });
        onDeleteCartItems();
        Alert.alert('Thành Công!', 'Đơn Hàng Của Bạn Đã Được Gửi Đi!');
        navigation.navigate('Cart');
        navigation.navigate('ProductList');
        console.log(response.data);
      } catch (error) {
        console.error('Error sending order:', error);
        Alert.alert('Gửi đơn hàng không thành công', 'Xảy ra lỗi. Hãy thử lại.');
      }
    
  };

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  
  const handleAddressSelect = (ad) => {
    setSelectedAddress(ad);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Địa chỉ:</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.pickerButtonText}>
          {selectedAddress ? `${selectedAddress.hoTen}\n${selectedAddress.soDienThoai}\n${selectedAddress.diaChi}` : 'Chọn địa chỉ'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={address}
            keyExtractor={(ad) => ad.maDiaChi.toString()}
            renderItem={({ item: ad }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => handleAddressSelect(ad)}>
                <Text style={styles.modalItemText}>{`${ad.hoTen}\n${ad.soDienThoai}\n${ad.diaChi}`}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <Text style={styles.title}>Danh Sách Giỏ Hàng:</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.maSach.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.hinhAnh }} style={styles.image} />
            <View>
              <Text style={styles.name}>{item.tenSach}</Text>
              <Text style={styles.price}>{VND.format(item.giaTien)} x {item.quantity}</Text>
              <Text style={styles.price}>Tổng: {VND.format(item.giaTien*item.quantity)}</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Tổng Tiền: {VND.format(total)}</Text>
      <TouchableOpacity style={styles.button} onPress={()=>handleCheckout()}>
        <Text style={styles.buttonText}>Xác Nhận Mua Hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
  },
  pickerButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  pickerButtonText: {
    fontSize: 18,
  },
  item: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: -1,
    flexDirection: 'row'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    fontSize: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 75,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    color: "grey",
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f4511e',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 'auto',
  },
  modalItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 18,
  },
});

export default Checkout;
