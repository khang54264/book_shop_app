import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import 'react-native-gesture-handler';
import ProductList from './ProductList';
import ProductPage from './ProductPage';
import CheckOut from './CheckOut';
import Cart from './Cart';
import User from './User';
import Login from './Login';
import Register from './Register';
import './CSS.css';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProductListScreen = ({ email, cartItems, onAddToCart, onUpdateCartItems }) => (
  <Stack.Navigator>
    <Stack.Screen name="ProductList" options={{ title: 'Đề Xuất' }}>
      {(props) => <ProductList {...props} email={email}  onAddToCart={onAddToCart} />}
    </Stack.Screen>
    <Stack.Screen name="ProductPage" options={{ title: 'Thông Tin Sản Phẩm' }} >
      {(props) => <ProductPage {...props} email={email} cartItems={cartItems} onAddToCart={onAddToCart} onUpdateCartItems={onUpdateCartItems} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const CartScreen = ({ email, cartItems, onUpdateCartItems, onDeleteCartItems }) => (
  <Stack.Navigator>
    <Stack.Screen name="Cart" options={{title: 'Giỏ Hàng'}}>
      {(props) => <Cart {...props} email={email} cartItems={cartItems} onUpdateCartItems={onUpdateCartItems} />}
    </Stack.Screen>
    <Stack.Screen name="CheckOut" options={{ title: 'Thanh Toán' }} >
      {(props) => <CheckOut {...props} email={email} onDeleteCartItems={onDeleteCartItems} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const PersonalScreen = ({  getEmail, deleteEmail }) => (
  <Stack.Navigator>
    <Stack.Screen name="Login" options={{title: 'Đăng Nhập'}}>
      {(props) => <Login {...props}  getEmail={getEmail} deleteEmail={deleteEmail}/>}
    </Stack.Screen>
    <Stack.Screen name="Register" options={{ title: 'Đăng Ký' }} >
      {(props) => <Register {...props}  getEmail={getEmail}/>}
    </Stack.Screen>
    <Stack.Screen name="User" options={{title: 'Thông Tin Người Dùng'}}>
      {(props) => <User {...props}  deleteEmail={deleteEmail}/>}
    </Stack.Screen>
  </Stack.Navigator>
);

const App = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [email, setEmail] = useState('');


  const getEmail = (email) => {
    setEmail(email);
  };
  
  const deleteEmail = () => {
    setEmail('');
  };

  const handleAddToCart = (product) => {
    setCartItems((prevCartItems) => {
      const itemIndex = prevCartItems.findIndex(
        (item) => item.maSach === product.maSach
      );
      if (itemIndex >= 0) {
        const updatedItems = [...prevCartItems];
        if (item.quantity<1) {
          updatedItems[itemIndex].quantity = 1;
          return updatedItems;
        }
        updatedItems[itemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevCartItems, { ...product, quantity: 1 }];
      }
    });
  };

  const updateCartItems = (items) => {
    const updatedItems = items.filter(item => item.quantity > 0);
    setCartItems(updatedItems);
  };

  const deleteCartItems = () => {
    setCartItems([]);
  };

  return (
      <NavigationContainer styles={styles.navigation}>
        <Tab.Navigator
          initialRouteName="ProductList"
          screenOptions={({ route })=>({
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'ProductListStack') {
                iconName = 'home';
              } else if (route.name === 'CartStack') {
                iconName = 'shopping';
              } else if (route.name === 'PersonalStack') {
                iconName = 'account';
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#f57c00",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: [
              {
                display: "flex"
              },
              null
            ]})}>
          <Tab.Screen name="ProductListStack" options={{ title: 'Trang Chính' }}>
            {(props) => <ProductListScreen {...props} email={email} cartItems={cartItems} onAddToCart={handleAddToCart} onUpdateCartItems={updateCartItems}/>}
          </Tab.Screen>
          <Tab.Screen name="CartStack" options={{
            title: 'Giỏ Hàng',
            tabBarLabel: ({ color}) => (
              <View style={styles.cartLabelContainer}>
                <Text style={{ color, fontSize: 10}}>Giỏ Hàng</Text>
                <Text style={styles.cartBadge}>{cartItems.length}</Text>
              </View>
            ),
          }}>
            {(props) => <CartScreen {...props} email={email} cartItems={cartItems} onUpdateCartItems={updateCartItems} onDeleteCartItems={deleteCartItems} />}
          </Tab.Screen>
          <Tab.Screen name="PersonalStack" options={{ title: 'Người Dùng' }}>
            {(props) => <PersonalScreen {...props}  getEmail={getEmail} deleteEmail={deleteEmail}/>}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  navigation:{
    overflow: 'auto',
  },
  header:{
    flexDirection: "column",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  cartLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    position: "absolute",
    top: -30,
    right: 0,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
});

export default App;
