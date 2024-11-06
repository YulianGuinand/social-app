import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { searchUserByName } from "../../../../services/userService";
import Input from "../../../shared/Input";

const SearchInput = ({ setResults }) => {
  const inputRef = useRef();
  const debounceTimeout = useRef(null);

  const handleSearch = async (query) => {
    if (query === "") {
      setResults([]);
      return;
    }
    let res = await searchUserByName(query);
    if (res.success) {
      setResults(res.data);
    } else {
      setResults([]);
    }
  };

  const handleOnChangeText = (value) => {
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      handleSearch(value);
    }, 2000); // délai de 2000 ms
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <Input
        style={{ width: "100%" }}
        onChangeText={handleOnChangeText}
        inputRef={inputRef}
        placeholder="Search for user name"
      />
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({});
