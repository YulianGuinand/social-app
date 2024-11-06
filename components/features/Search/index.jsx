import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { wp } from "../../../helpers/common";
import Header from "../../shared/Header";
import ScreenWrapper from "../../shared/ScreenWrapper";
import ResultList from "./List";
import SearchInput from "./SearchInput";

const SearchScreen = () => {
  const [results, setResults] = useState([
    // {
    //   adress: "",
    //   bio: "",
    //   created_at: "2024-10-19T12:28:15.115602+00:00",
    //   email: "lise.bonnefoux@gmail.com",
    //   id: "65112b11-1257-4ad9-b55d-86ee2792c6bc",
    //   image: "profiles/1729340940962.png",
    //   name: "Lise",
    //   phoneNumber: "",
    // },
    // {
    //   adress: null,
    //   bio: "coucou *4",
    //   created_at: "2024-10-22T09:31:34.790051+00:00",
    //   email: null,
    //   id: "8640dfda-ddce-427f-b416-335b6361e51a",
    //   image: null,
    //   name: "test",
    //   phoneNumber: null,
    // },
    // {
    //   adress: "Dole",
    //   bio: "feel the sea 🌊,And feel the sky ☁️Let your soul and spirit fly 🦋.",
    //   created_at: "2024-10-15T20:43:14.825472+00:00",
    //   email: "yulianguinand@orange.fr",
    //   id: "4c8cc615-4c66-4b82-8efd-24742f011fef",
    //   image: "profiles/1729032366019.png",
    //   name: "Yulian",
    //   phoneNumber: "0784953553",
    // },
    // {
    //   adress: null,
    //   bio: "Salut 👋🏻, Je suis le deuxième test !",
    //   created_at: "2024-10-24T07:10:30.606231+00:00",
    //   email: null,
    //   id: "1e826d36-f591-46fd-9007-4255fbedcab3",
    //   image: null,
    //   name: "Test2",
    //   phoneNumber: null,
    // },
    // {
    //   adress: null,
    //   bio: null,
    //   created_at: "2024-11-02T13:54:06.429606+00:00",
    //   email: null,
    //   id: "9f9cc448-a7b8-4a97-8030-3e4f2432232c",
    //   image: null,
    //   name: "Lylou103",
    //   phoneNumber: null,
    // },
  ]);
  return (
    <ScreenWrapper bg="white">
      <View style={{ paddingHorizontal: wp(4) }}>
        {/* HEADER */}
        <Header title={"Search"} />

        {/* INPUT */}
        <SearchInput setResults={setResults} />
      </View>
      {/* RESULT */}
      <ResultList data={results} />
    </ScreenWrapper>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
