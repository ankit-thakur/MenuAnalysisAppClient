import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Button, ScrollView, FlatList, Text, StatusBar } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import SearchBar from './SearchBar';
import FilterDropdownComponent from './FilterComponent';
import MenuInputComponent from './MenuInputComponent';
import QRScanner from './QRScanner';
import AlertOverlay from '@/components/AlertOverlay';
import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../app/App';
// import { useWebSocket } from '../websocket/WebSocketContext'; // Import the WebSocket hook
import webSocketInstance from '@/websocket/WebSocketInstance';
import 'react-native-get-random-values'
import { nanoid } from 'nanoid';
import fs from 'fs';
import axios from 'axios';
import { NativeStackScreenProps } from "@react-navigation/native-stack";


interface SearchPlaceResult {
  place_id: string;
  name: string;
  address: string;
  menu_url: string;
}

// type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

type Props = {
  placeId?: string;
  connectionKey: string;
};

function HomeScreen({ placeId, connectionKey }: Props) {

// const HomeScreen: React.FC<HomeScreenProps> = ({ route, navigation }) => {


  const [selectedAllergens, setSelectedAllergens] = useState<CheckboxItem[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<CheckboxItem[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [safeResults, setSafeResults] = useState<any[]>([]);
  const [unsafeResults, setUnsafeResults] = useState<any[]>([]);
  const [showMenuInput, setShowMenuInput] = useState<boolean>(false);
  const [searchPlaceResult, setSearchPlaceResult] = useState<SearchPlaceResult>();

  // const { connectionKey, placeId } = route.params;

  console.log("*** ConnectionKey: ", connectionKey);
  console.log("*** placeId: ", placeId);

  useEffect(() => {
    queryRestaurants({place_id: placeId, connectionKey: connectionKey});
  }, [placeId]);

 
  // filter results on selected allergen and diet filters
  useEffect(() => {
    const selectedAllergenFilterSet = selectedAllergens ? new Set(selectedAllergens.filter(filter => filter.checked).map(filter => filter.label.toLowerCase())): new Set();
    const selectedDietFilterSet = selectedDiets ? new Set(selectedDiets.filter(filter => filter.checked).map(filter => filter.label.toLowerCase())): new Set();

    let safe: React.SetStateAction<any[]> = [];
    let unsafe: React.SetStateAction<any[]> = [];

    results.forEach((item: any) => {
      // if item has an allergen that is also in the list of filters than it is unsafe
      const allergyIntersection = item.allergens?.filter((allergy: string) => selectedAllergenFilterSet.has(allergy.toLowerCase())) ?? [];
      const dietIntersection = item.diet_restrictions?.filter((diet: string) => selectedDietFilterSet.has(diet.toLowerCase())) ?? [];
      
      // allergyIntersection.length > 0 || dietIntersection.length > 0 ? unsafe.push(item) : safe.push(item);

      if (allergyIntersection?.length || dietIntersection?.length) {
        unsafe.push(item);
      } else {
        safe.push(item);
      }
    });

    setSafeResults(safe);
    setUnsafeResults(unsafe);
    
  }, [results, selectedAllergens, selectedDiets]);


  // useEffect(() => {

  //   const handler = async (message: any) => {
  //     console.log("* Message registered: ", message);
  //     if (Array.isArray(message)) {
  //       if (message[0] === "menuAlreadyProcessed") {
  //         console.log("* MenuAlreadyProcessed *");
  //         setShowMenuInput(false);
  //         setResults(message[1]);
  //       } else if (message[0] === "finalMenuOutputAction") {
  //         console.log("* finalMenuOutputAction, querying table *");
  //         setShowMenuInput(false);
  //         queryRestaurants(searchPlaceResult);

  //       } else if (message[0] === "menuNotProcessed") {
  //         setShowMenuInput(true);
  //       }
  //     } else {
  //       console.log("* useEffect message handler");
  //       setResults((prevMessages) => [...prevMessages, message[1]]);
  //     }
  //   };
  
  //   webSocketInstance.registerMessageHandler(handler);

  // }, [searchPlaceResult]);

  useEffect(() => {
    console.log("* results have changed: ", results);
  }, [results]);

  console.log("* useEffect message: ", results);

  type ItemProps = {name: string, price: string, ing_list: string[], allergens: string[], diet_restrictions: string[]};
  const Item = ({name, price, ing_list, allergens, diet_restrictions}: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.ing}>{ing_list.join(', ')}</Text>
      {allergens?.length ? <Text style={styles.ing}>Contains allergens: {allergens.join(', ')}</Text> : null}
      {diet_restrictions?.length ? <Text style={styles.ing}>Not suitable for dietary restrictions: {diet_restrictions.join(', ')}</Text> : null}      
    </View>
  );

  type CheckboxItem = {
    id: string;
    label: string;
    checked: boolean;
  };

  const allergenFilters: CheckboxItem[] = [
    { id: '1', label: 'Milk', checked: false },
    { id: '2', label: 'Eggs', checked: false },
    { id: '3', label: 'Peanuts', checked: false },
    { id: '4', label: 'Tree Nuts', checked: false },
    { id: '5', label: 'Soy', checked: false },
    { id: '6', label: 'Sesame', checked: false },
    { id: '7', label: 'Wheat', checked: false },
    { id: '8', label: 'Fish', checked: false },
    { id: '9', label: 'Shellfish', checked: false },
    { id: '10', label: 'Cashews', checked: false },
  ];

  const dietaryFilters: CheckboxItem[] = [
    { id: '1', label: 'Vegetarian', checked: false },
    { id: '2', label: 'Vegan', checked: false },
    { id: '3', label: 'Gluten-free', checked: false },
    { id: '4', label: 'Dairy-free', checked: false },
  ];

  // const numResText = () => {
  //   const allergenLength = selectedAllergens.length;
  //   const dietLength = selectedDiets.length;
  //   if (allergenLength > 0 && dietLength > 0) {
  //     return `${tempResults.length} results without ${selectedAllergens} and ${selectedDiets} friendly`;
  //   } else if (allergenLength > 0) {
  //     return `${tempResults.length} results without ${selectedAllergens}`;
  //   } else if (dietLength > 0) {
  //     return `${tempResults.length} ${selectedDiets} friendly results`;
  //   } else {
  //     return `${tempResults.length} results`;
  //   }
  // }

  // Handler to update the selected checkboxes
  const handleAllergensChange = (selected: CheckboxItem[]) => {
    setSelectedAllergens(selected);
  };
  // Handler to update the selected checkboxes
  const handleDietsChange = (selected: CheckboxItem[]) => {
    setSelectedDiets(selected);
  };

  // Handler to set menu url input
  const onSubmitMenuInput = async (menuInput: string, emailInput: string, addToList: boolean) => {
    console.log("*** MenuInput: ", menuInput);
    console.log("*** EmailInput: " + emailInput + ", addToList: " + addToList);

    const apiEndpoint = 'https://jlpothzo0g.execute-api.us-east-1.amazonaws.com/prod/invokeAnalyzeMenu';
    const params = {
      place_id: searchPlaceResult?.place_id,
      name: searchPlaceResult?.name,
      address: searchPlaceResult?.address,
      menu_url: menuInput,
      email: emailInput,
      addToList: addToList,
      connectionKey: connectionKey
    }

    try {
      const response = await axios.post(apiEndpoint, params);
      console.log(response); // Handle response
      // const data = await response.data;
    } catch (error) {
      console.error(error);
    }
  };
  

  const queryRestaurants = async (result: any) => {
    console.log("* query restaurants input: ", result);
    setSearchPlaceResult({
      place_id: result.place_id,
      name: result.name,
      address: result.formatted_address,
      menu_url: ''
    });

    const queryRestaurantsApiEndpoint = 'https://2ojlzevla1.execute-api.us-east-1.amazonaws.com/prod/queryRestaurants';
    const params = {
      placeId: result.place_id,
      connectionKey: connectionKey
    }
    
    var response;
    try {
      response = await axios.post(queryRestaurantsApiEndpoint, params);
      console.log("*** queryRestaurants: ", response); // Handle response
      
      if (response.data && response.data.length > 0) {
        setResults(response.data);
        setShowMenuInput(false);
      } else {
        console.log("No results found for the given placeId.");
        setShowMenuInput(true);
      }
    } catch (error) {
      console.error(error);
      // setShowMenuInput(true);
    }
    console.log("* showMenuInput: ", showMenuInput);
  };

  return (
    <View style={styles.container}>
      <AlertOverlay
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        externalLink="https://example.com"
        internalPage="Help"
        errorMessage="Unable to load data!"
      />
      <SearchBar onSelect={ queryRestaurants } connectionKey={connectionKey}/>
      <QRScanner />

      <View style={styles.filtersContainer} testID='filtersContainer'>
        <FilterDropdownComponent name='Allergens' checkboxItems={ allergenFilters } onSelect={ handleAllergensChange }/>
        <FilterDropdownComponent name='Diets' checkboxItems={ dietaryFilters } onSelect={ handleDietsChange }/>
      </View>
      {
        showMenuInput ? <MenuInputComponent onSubmit={ onSubmitMenuInput }/> : null
      }
      <View style={styles.results}>
        {
          safeResults.length !== 0 ? <Text style={styles.itemHeaders}>{`Based on what we know, here's ${safeResults.length} results:`}</Text> : null
        }
        <ScrollView style={styles.resultsContainer}>
          <FlatList
            data={ safeResults }
            renderItem={({item}) =>
              <Item name={item.name} 
                price={item.price}
                ing_list={item.ingredients}
                allergens={item.allergens}
                diet_restrictions={item.diet_restrictions}
              />
            }
            keyExtractor={item => item.name}
          />
          {
            unsafeResults.length !== 0 ? <Text style={styles.itemHeaders}>Stay away from the following: </Text> : null
          }
          
          <FlatList
            data={ unsafeResults }
            renderItem={({item}) =>
              <Item name={item.name} 
                price={item.price}
                ing_list={item.ingredients}
                allergens={item.allergens}
                diet_restrictions={item.diet_restrictions}
              />
            }
            keyExtractor={item => item.name}
          />
        </ScrollView>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  results: {
    flex: 1,
    marginTop: 16,
  },
  menuInputBox: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    flexWrap: 'wrap',
  },
  inputButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultsContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  itemHeaders: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    paddingBottom: 5,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#dedede',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 6,
  },
  name: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    paddingBottom: 5,
  },
  price: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    paddingBottom: 5,
  },
  ing: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    paddingBottom: 5,
  }
});

export default HomeScreen;
