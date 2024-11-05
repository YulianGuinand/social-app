import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import Input from "../../../shared/Input";
import { searchUserByName } from "../../../../services/userService";
import { wp } from "../../../../helpers/common";
import { theme } from "../../../../constants/theme";

const SearchInput = ({ setResults }) => {
  const inputRef = useRef();

  const handleOnChange = async () => {
    if (inputRef.current.value === "") return null;
    let res = await searchUserByName(inputRef.current.value);

    if (res.success) {
      setResults([]);
      setResults(res.data);
    }
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <Input
        style={{ width: wp(65) }}
        onChangeText={(value) => {
          inputRef.current.value = value;
        }}
        inputRef={inputRef}
        placeholder="Search for user name"
      />
      <TouchableOpacity
        style={{
          flex: 1,
          borderRadius: theme.radius.md,
          borderColor: theme.colors.primary,
          borderWidth: 1,
          borderCurve: "continuous",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={handleOnChange}
      >
        <Text>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({});
