import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, Image, TextInput, TouchableOpacity, ScrollView, Modal} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import ProductItem from './ProductItem';
import ProductPage from './ProductPage';
import Cart from "./Cart";

const numColumns = 2;
const ProductList = ({email, onAddToCart}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText,setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigation = useNavigation();

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  useEffect(() => {
    axios.get('http://192.168.45.162:55571/Sach/GetAllBooks')
        .then(response => {
            setProducts(response.data);
            setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const onSearchPress = async () => {
    if (!searchText.trim()) {
      axios.get('http://192.168.45.162:55571/Sach/GetAllBooks')
        .then(response => {
            setProducts(response.data);
            setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
      return;
    } else {
      try{
        console.log(`http://192.168.45.162:55571/Sach/SearchBookByName?name=${searchText}`);
        axios.get(`http://192.168.45.162:55571/Sach/SearchBookByName?name=${searchText}`)
        .then(response => {
            setProducts(response.data); 
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
      } catch (error) {
        console.error('Cant Search', error);
      }
    }
  };


  const handleProductPress = (product) => {
    navigation.navigate("ProductPage", {product});
  };

  const filterProducts = () => {
    switch (selectedCategory) {
      case 'comic':
        return products.filter(product => product.maLoaiSach === 'comic');
      case 'novel':
        return products.filter(product => product.maLoaiSach === 'novel');
      default:
        return products;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* <Text>Email: {email}</Text> */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm sản phẩm"
          onChangeText={setSearchText}
          value={searchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={()=>onSearchPress()}>
          <Text style={styles.searchButtonText}>Tìm Kiếm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Toàn Bộ" value="all" />
          <Picker.Item label="Truyện Tranh" value="comic" />
          <Picker.Item label="Tiểu Thuyết" value="novel" />
        </Picker>
      </View>
      <FlatList
      data={(filterProducts())}
      renderItem={({ item }) => (
        <ProductItem 
          product={item} 
          onPress={() => handleProductPress(item)}
          onAddToCart={() => onAddToCart(item)} />
      )}
      keyExtractor={(item) => item.maSach.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.row}
      />
    </View>
    
  );
};

// const shuffleArray = (array) => {
//   let shuffledArray = [...array];
//   for (let i = shuffledArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
//   }
//   return shuffledArray;
// };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    overflow: 'scroll',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
  },
  pickerContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  cartButton: {
    position: "relative",
    marginRight: 10,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    paddingHorizontal: 5,
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  }
});

export default ProductList;
