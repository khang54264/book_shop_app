import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, Image, TextInput, TouchableOpacity, ScrollView, Modal, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';

const Register = ({getEmail}) => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [chk, setChk] = useState([]);
    const navigation = useNavigation();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const onRegisterPress = async () => {
        // Input validation (optional, but recommended)
        if (!email || !password || !firstName || !lastName) {
            Alert.alert('Please fill in all fields');
            return;
        }
        try{
            console.log('http://192.168.45.162:55571/TaiKhoan/CheckEmail?email='+`${email}`+'');
            axios.get('http://192.168.45.162:55571/TaiKhoan/CheckEmail?email='+`${email}`+'')
            .then(response => {
                setChk(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
            const i = chk.at(0).CheckEmail;
            console.log(chk.at(0).CheckEmail)
            if (i===0) {
                Alert.alert('Checked','Email Mới!');
                try {
                    const response = await axios.post('http://192.168.45.162:55571/TaiKhoan/UserRegister', {
                        ho: lastName,
                        ten: firstName,
                        email: email,
                        soDienThoai: phone,
                        matKhau: password,
                    });
        
                    console.log(response.data); // For debugging purposes
                    getEmail(email);
                    navigation.navigate('User', { email }); // Assuming 'User' is the screen after registration
                } catch (error) {
                    console.error('Error registering user:', error);
                    Alert.alert('Đăng ký không thành công', 'Xảy ra lỗi. Hãy thử lại.');
                }
            } else if (i===1){
                Alert.alert('Registered', 'Email này đã được đăng ký!');
            }
        } catch (error) {
            console.error('Cant Check Email', error);
        }

    };
  
    return (
      <View style={styles.container}>
            <Text style={styles.title}>Đăng Ký</Text>
            <TextInput
                style={styles.input}
                placeholder="Họ"
                value={lastName}
                onChangeText={setLastName}
                keyboardType="default"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Tên"
                value={firstName}
                onChangeText={setFirstName}
                keyboardType="default"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
                autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>onRegisterPress()} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Đăng Ký</Text>
            </TouchableOpacity>
        </View>
      
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#fff',
  },
  title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
  },
  input: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 15,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
},
eyeIcon: {
    marginTop: -15,
    marginLeft: -35,
},
  loginButton: {
      width: '100%',
      padding: 15,
      backgroundColor: '#ff6347',
      alignItems: 'center',
      borderRadius: 5,
  },
  loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
  registerText: {
      marginTop: 20,
      color: '#ff6347',
      fontSize: 14,
  },
  });
  
  export default Register;
  