import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import Icon from "react-native-vector-icons/MaterialIcons";
import currenciesList from './currencies';

const API_BASE_URL = 'https://api.exchangerate.host';

export default function App() {
  const [amount, setAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [conversionResult, setConversionResult] = useState('');
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);


  const toggleCurrencyModal = () => {
    setCurrencyModalVisible(!isCurrencyModalVisible);
  };

  const convertCurrency = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/convert`, {
        params: {
          from: sourceCurrency,
          to: targetCurrency,
          amount: parseFloat(amount),
        },
      });

      if (response.data.success) {
        setConversionResult(response.data.result);
      } else {
        console.error('Conversion failed.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const switchCurrencies = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Currency Exchange Calculator</Text>
      <br />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Source Currency"
        value={sourceCurrency}
        onChangeText={(text) => setSourceCurrency(text.toUpperCase())}
      />
      <TextInput
        style={styles.input}
        placeholder="Target Currency"
        value={targetCurrency}
        onChangeText={(text) => setTargetCurrency(text.toUpperCase())}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={toggleCurrencyModal}>
          <Icon name="list" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer} onPress={switchCurrencies}>
          <Icon name="swap-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <br />
      <Button title="Convert" onPress={convertCurrency} />
      <Text style={styles.conversion}>Conversion Result: {conversionResult}</Text>

        {/* Currency Modal */}
      <Modal isVisible={isCurrencyModalVisible}>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.scrollView}>
            <h1 style={styles.modalTitle}>Available Currencies</h1>
            {currenciesList.map((currency, index) => (
              <Text key={index} style={styles.currencyItem}>
                {currency}
              </Text>
            ))}
          </ScrollView>
          <br />
          <Button title="Close" onPress={toggleCurrencyModal} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    width: '100%',
  },
    modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  currencyItem: {
    fontSize: 16,
    marginBottom: 8,
  },
  scrollView: {
    maxHeight: 500,
  },
  headerText: {
    fontSize: 25,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  conversion: {
    fontSize: 20,
  }
});
