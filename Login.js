import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, Image, TextInput, TouchableOpacity, ScrollView, Modal, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';

const Login = ({  getEmail, deleteEmail}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [chk, setChk] = useState([{"CheckLogin": 2}]);
    const navigation = useNavigation();


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onLoginPress = (email, pass) => {
            axios.get('http://192.168.45.162:55571/TaiKhoan/CheckLogin?email='+`${email}`+'&password='+`${pass}`+'')
            .then(response => {
                setChk(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
            const i = chk.at(0).CheckLogin;
            if (i===1) {
                Alert.alert('Thành Công !', 'Đăng Nhập Thành Công!');
                getEmail(email);
                navigation.navigate('User', {email});
            } else if (i===0){
                Alert.alert('Wrong Information','Email Hoặc Mật Khẩu Sai!');
            }
        
        
    };

    const onRegisterPress = () => {
        navigation.navigate('Register');
    };
  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Nhập</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
            <TouchableOpacity onPress={()=>onLoginPress(email, password)} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>onRegisterPress()}>
                <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký</Text>
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
        fontSize: 18,
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
        marginTop: 30,
        color: '#ff6347',
        fontSize: 14,
    },
  });
  
  export default Login;
  