import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../Styles/appStyle';

const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
  width: 80%;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 5px;
`;

const AmountInput = ({ error, label, claimAmount, setClaimAmount }) => {
  return (
    <>
      {/* <Label>{label}</Label> */}
      <Input
        placeholder="Enter Quantity"
        keyboardType="numeric"
        value={claimAmount}
        onChangeText={setClaimAmount}
      />
      {error && (
        <Text style={{marginTop: 7, color: colors.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </>
  );
};

export default AmountInput;
