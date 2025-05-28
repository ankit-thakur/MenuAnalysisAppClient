import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Platform
} from 'react-native';
// import WebSocketClient from '../websocket/WebSocketService';
import { nanoid } from 'nanoid';
// import { useWebSocket } from '../websocket/WebSocketContext'; // Import the WebSocket hook
import webSocketInstance from '@/websocket/WebSocketInstance';
import { Buffer } from "buffer";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
// import { Sha256 } from "@aws-crypto/sha256-js";
import axios from 'axios';



type SearchResult = { name: string, formatted_address: string, place_id: string };

interface SearchBarProps {
  connectionKey: string,
  onSelect: (selected: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ connectionKey, onSelect }) => {

  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SearchResult[]>();

  const handleSearch = async () => {

    const apiEndpoint = 'https://5g1l055sob.execute-api.us-east-1.amazonaws.com/prod/searchPlaceId';
    const params = {
      searchQuery: query
    }
    
    try {
      const searchResults = await axios.post(apiEndpoint, params);

      console.log(searchResults); // Handle response
      const data = await searchResults.data;

      setResults(data)
      setShowResults(true);
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectResult = async (result: SearchResult) => {
    console.log("* handleSelectResult result: ", result);
    console.log("* handleSelectResult connectionKey: ", connectionKey);

    onSelect(result);

    // API to the  menu_analyzer_lambda_handler Lambda
    // This API is just a trigger to the backend. It should not return any data
    const apiEndpoint = 'https://jlpothzo0g.execute-api.us-east-1.amazonaws.com/prod/invokeAnalyzeMenu';
    const params = {
      placeId: result.place_id,
      connectionKey: connectionKey
    }
    
    // try {
    //   const response = await axios.post(apiEndpoint, params);
    //   console.log(response); // Handle response
    //   const data = await response.data;
    // } catch (error) {
    //   console.error(error);
    // }
 
    setQuery(result.name); // You can set the selected result to the search bar if desired
    setShowResults(false); // Collapse the result view after selection

    // const selected_json = await placeDetails.json();
    // console.log("*** place details selected_json: ", selected_json);

    // // call get_menu here
    // const menu = await getMenu(selected_json.website, selected_json.name, selected_json.formatted_address);
    // const menu_json = await menu.json();
    // console.log("*** menu_json: ", menu_json);
     
    // setSelected(menu_json);
  };

  // invokes the GetMenu API to get the menu URL from the restaurant website's HTML
  const getMenu = async (url: string, name: string, address: string) => {
    return await fetch('https://7r4fqbddre.execute-api.us-east-1.amazonaws.com/prod/', {
      method: 'POST',
      body: JSON.stringify({
        url: url,   
        name: name,
        location: address
      })
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {showResults && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectResult(item)}
              >
                <Text style={styles.resultText}>{item.name}</Text>
                <Text style={styles.resultText}>{item.formatted_address}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 10,
    alignItems: 'stretch',
  },
  searchBar: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  resultsContainer: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    maxHeight: 200, // Limits how tall the result list can expand
    borderWidth: 1,
    borderColor: '#DDD',
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});

export default SearchBar;
