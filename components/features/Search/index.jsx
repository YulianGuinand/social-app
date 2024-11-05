import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../shared/ScreenWrapper";
import Header from "../../shared/Header";
import { wp } from "../../../helpers/common";
import SearchInput from "./SearchInput";
import ResultList from "./List";

const SearchScreen = () => {
  const [results, setResults] = useState([]);
  return (
    <ScreenWrapper bg="white">
      <View style={{ paddingHorizontal: wp(4) }}>
        {/* HEADER */}
        <Header title={"Search"} />

        {/* INPUT */}
        <SearchInput setResults={setResults} />

        {/* RESULT */}
        <ResultList data={results} />
      </View>
    </ScreenWrapper>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
