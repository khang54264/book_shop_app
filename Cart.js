import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import Checkout from "./CheckOut";

const Cart = ({ email, cartItems, onUpdateCartItems}) => {
  const [items, setItems] = useState(cartItems);

  const navigation = useNavigation();

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const updateCartItems = (items) => {
    const updatedItems = items.filter(item => item.quantity > 0);
    setItems(updatedItems);
    onUpdateCartItems(updatedItems); 
  };

  const updateQuantity = (id, quantity) => {
    const updatedItems = items.map((item) => {
      if (item.maSach === id) {
        return { ...item, quantity };
      }
      return item;
    })
    .filter(item => item.quantity>0);
    updateCartItems(updatedItems);
  };

  const handleBuyPress = ({email, cartItems: items, total}) => {
    if (email.trim()==='') {
      Alert.alert('Đăng Nhập', 'Chưa Đăng Nhập!');
      navigation.navigate("Login");
      return;
    }
    if (total === 0) {
      Alert.alert('Giỏ Hàng Trống', 'Không có sản phẩm nào trong giỏ hàng!');
    } else {
      navigation.navigate("CheckOut", { email,  items, total });
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.giaTien * item.quantity, 0);
  };

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.maSach}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.hinhAnh }} style={styles.image} />
            <View>
              <Text style={styles.name}>{item.tenSach}</Text>
              <Text style={styles.price}>Đơn Giá: {VND.format(item.giaTien)}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => updateQuantity(item.maSach, item.quantity - 1)}>
                  <Ionicons name="remove-circle-outline" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.maSach, item.quantity + 1)}>
                  <Ionicons name="add-circle-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.delete} onPress={() => updateQuantity(item.maSach, 0)}>
              <Ionicons name="trash-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.total}>Tổng tiền: {VND.format(calculateTotal())}</Text>
        
      <View style={styles.footer}>
      <TouchableOpacity style={styles.purchaseButton} onPress={() => handleBuyPress({email, cartItems: items, total: calculateTotal()}) }>
          <Text style={styles.purchaseText}><Ionicons name="pricetag-outline" size={20} color="white" style={{paddingRight:5,marginTop:5,}}/> Mua hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: -1,
    flexDirection: 'row'
  },
  name: {
    fontSize: 18,
  },
  image: {
    width: 60,
    height: 90,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: "grey",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    marginHorizontal: 10,
  },
  delete: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 50,
  },
  footer: {
    flex:1,
    flexDirection: 'row',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    
  },
  purchaseButton:{
    height: 40,
    paddingBottom: 5,
    borderRadius:5,
    borderWidth: 3,
    borderColor: '#f4511e',
    backgroundColor: '#f4511e',
    right: 0,
    textAlign: 'center',
  },
  purchaseText:{
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'left',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    alignContent: 'center',
  }
});

export default Cart;
