import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, Image, TextInput, TouchableOpacity, ScrollView, Modal} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';

const User = ({ route, deleteEmail }) => {
    const {email} = route.params;
    const [user, setUser] = useState([]);
    const [address, setAddress] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [currentList, setCurrentList] = useState('address');
    const [isAddressModalVisible, setAddressModalVisible] = useState(false);
    const [newAddress, setNewAddress] = useState({ hoTen: '', soDienThoai: '', diaChi: '' });
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const VND = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

    useEffect(() => {
      axios.get('http://192.168.45.162:55571/TaiKhoan/GetDataUser?email='+`${email}`+'')
          .then(response => {
              setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

        axios.get('http://192.168.45.162:55571/TaiKhoan/GetAllOrderByUser?email='+`${email}`+'')
          .then(response => {
              setOrderList(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

        axios.get(`http://192.168.45.162:55571/TaiKhoan/GetAllAddressByUser?email=${email}`)
        .then(response => {
            setAddress(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, []);

    const ChangeAddressDefault = async(email, maDiaChi) => {
      try {
        await axios.post(`http://192.168.45.162:55571/TaiKhoan/ChangeDefaultAdress?email=${email}.com&madiachi=${maDiaChi}`);
        axios.get(`http://192.168.45.162:55571/TaiKhoan/GetAllAddressByUser?email=${email}`)
        .then(response => {
          setAddress(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
      } catch (error) {
        console.error('Error change default address:', error);
      }
    };

    const addNewAddress = async () => {
      try {
        await axios.post('http://192.168.45.162:55571/TaiKhoan/CreateAddress', { email, ...newAddress });
        axios.get(`http://192.168.45.162:55571/TaiKhoan/GetAllAddressByUser?email=${email}`)
          .then(response => {
            setAddress(response.data);
            setAddressModalVisible(false);
            setNewAddress({ hoTen: '', soDienThoai: '', diaChi: '' });
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      } catch (error) {
        console.error('Error adding new address:', error);
      }
    };

    const changePassword = async () => {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      try {
        await axios.post('http://192.168.45.162:55571/TaiKhoan/ChangePassword', { email, password, confirmPassword });
        setPasswordModalVisible(false);
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        console.error('Error changing password:', error);
      }
    };
  
    return (
        <View style={styles.container}>
            <View style={styles.welcome}>
              <Text style={styles.title}>Xin Chào </Text>
              <Text style={styles.name}>{user.ho} {user.ten}</Text>
              <Text style={styles.title}> !</Text>
            </View>
            <View style={styles.email}>
              <Text style={styles.title}>Email: </Text>
              <Text style={styles.name}>{user.email}</Text>
            </View>

            <View style={styles.buttonsAddContainer}>
              <TouchableOpacity style={styles.button} onPress={() => setAddressModalVisible(true)}>
                <Text style={styles.buttonText}>Thêm Địa Chỉ Mới</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setPasswordModalVisible(true)}>
                <Text style={styles.buttonText}>Đổi Mật Khẩu</Text>
              </TouchableOpacity>
            </View>

            <Modal visible={isAddressModalVisible} transparent={true}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TextInput
                    style={styles.input}
                    placeholder="Họ tên"
                    value={newAddress.hoTen}
                    onChangeText={(text) => setNewAddress({ ...newAddress, hoTen: text })}
                  />
                  <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={newAddress.soDienThoai}
              onChangeText={(text) => setNewAddress({ ...newAddress, soDienThoai: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={newAddress.diaChi}
              onChangeText={(text) => setNewAddress({ ...newAddress, diaChi: text })}
            />
            <TouchableOpacity style={styles.button} onPress={addNewAddress}>
              <Text style={styles.buttonText}>Thêm Địa Chỉ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setAddressModalVisible(false)}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isPasswordModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu cũ"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={changePassword}>
              <Text style={styles.buttonText}>Đổi Mật Khẩu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setPasswordModalVisible(false)}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

            <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentList('address')}>
          <Text style={styles.buttonText}>Danh Sách Địa chỉ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentList('orders')}>
          <Text style={styles.buttonText}>Danh Sách Đơn Hàng</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {currentList === 'address' && (
          <FlatList
            data={address}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity onPress={() => ChangeAddressDefault(email, item.maDiaChi)}>
                  <Text style={[styles.title, item.macDinh === 1 && styles.bold]}>Họ tên: {item.hoTen}</Text>
                  <Text style={[styles.title, item.macDinh === 1 && styles.bold]}>Số điện thoại: {item.soDienThoai}</Text>
                  <Text style={[styles.title, item.macDinh === 1 && styles.bold]}>Địa chỉ: {item.diaChi}</Text>
                </TouchableOpacity>
              </View>
            )}
            numColumns={1}
            contentContainerStyle={styles.listContent}
          />
        )}
        {currentList === 'orders' && (
          <FlatList
            data={orderList}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity>
                  <Text style={styles.title}>Họ tên: {item.hoTen}</Text>
                  <Text style={styles.title}>Số điện thoại: {item.soDienThoai}</Text>
                  <Text style={styles.title}>Địa chỉ: {item.diaChi}</Text>
                  <Text style={styles.title}>Ngày đặt: {item.ngay}</Text>
                  <Text style={styles.title}>Tổng tiền đơn: {VND.format(item.tongTien)}</Text>
                </TouchableOpacity>
              </View>
            )}
            numColumns={1}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
            
        </View>
      
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    bold: {
      fontWeight: 'bold',
    },
    item: {
      borderWidth: 1,
      borderColor: "#ddd",
      borderWidth: 1,
      marginTop: -1,
      padding: 10,
      flexDirection: 'row'
    },
    welcome:{
      flex: 1,
      flexDirection: 'row',
      padding: 0,
    },
    order: {
      flex:1,
      marginTop: -360,
      marginLeft: 20,
      marginRight: 20,
    },
    email: {
      flex: 1,
      marginTop: -250,
      flexDirection: 'row',
      padding: 0,
    },
    name: {
      fontSize: 16,
      marginBottom: 20,
      fontWeight: 'bold',
      color: 'blue'
    },
    title: {
      fontSize: 16,
      marginBottom: 20,
    },
    buttonsAddContainer: {
      marginTop: -250,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginLeft: 5,
      marginRight: 25,
    },
    buttonsContainer: {
      marginTop: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    button: {
      padding: 10,
      backgroundColor: '#007BFF',
      margin: 5,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    listContainer: {
      marginTop: 0,
      flex: 1,
    },
    listContent: {
      paddingBottom: 20,
    },
    row: {
      flex: 1,
      justifyContent: 'space-between',
    },
    addButton: {
      padding: 10,
      backgroundColor: '#28a745',
      borderRadius: 5,
      marginVertical: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
    },
  });
  
  export default User;
  