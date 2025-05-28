// index.tsx
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo Go app, or in a native build,
// the environment is set up appropriately
registerRootComponent(App);




// import { Button, FlatList, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
// import { useState } from 'react'


// export default function Index() {

//   const [menuInput, setMenuInput] = useState('');
//   const [allergyInput, setAllergyInput] = useState<string[]>([]);
//   const [result, setResult] = useState<any[]>([]);
  
//   const handleModel = async () => {
//     console.log("*****");
//     console.log("* allergyInput: ", allergyInput);

//     const response = await fetch('https://hl77ylnwt5.execute-api.us-east-1.amazonaws.com/prod/', {
//       method: 'POST',
//       body: JSON.stringify({
//         menu: menuInput,
//         allergies: allergyInput
//       })
//     });
        
//     const json = await response.json();
//     setResult(json);
//   };

//   console.log("* result: ", result);

//   type ItemProps = {name: string, price: string, ing_list: string[], allergens: string[] };
//   const Item = ({name, price, ing_list, allergens}: ItemProps) => (
//     <View style={styles.item}>
//       <Text style={styles.name}>{name}</Text>
//       <Text style={styles.price}>{price}</Text>
//       <Text style={styles.ing}>{ing_list}</Text>
//       <Text style={styles.ing}>Allergens: {allergens}</Text>
//     </View>
//   );

//   return (
//     <View style={{flex: 1}}>
//       <TextInput style={styles.menuInputBox}
//         onChangeText={setMenuInput}
//         value={menuInput}
//         placeholder="Enter menu text here..."
//         multiline={true}
//       />

//       <View style={styles.inputButtonContainer}>
//         <View style={styles.row}>
//           <Button
//             onPress={() => setAllergyInput([...allergyInput, "nuts"])}
//             title="Nuts"
//           />          
//           <Button
//             onPress={() => setAllergyInput([...allergyInput, "fish"])}
//             title="Fish"
//           />
//           <Button
//             onPress={() => setAllergyInput([...allergyInput, "gluten"])}
//             title="Gluten"
//           />
//         </View>
//       </View>

//       <Button
//         onPress={handleModel}
//         title="Submit"
//         color="#841584"
//         accessibilityLabel="Submit menu for dietary restriction analysis"
//       />

//       <ScrollView style={styles.container}>
//         <FlatList
//           data={result}
//           renderItem={({item}) => 
//             <Item name={item.name} 
//               price={item.price} 
//               ing_list={item.listed_ingredients.concat(item.typical_ingredients).map(String).join(', ')}
//               allergens={item.allergens.map(String).join(', ')}
//             />
//           }
//           keyExtractor={item => item.name}
//         />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   menuInputBox: {
//     height: 100,
//     margin: 12,
//     borderWidth: 1,
//     padding: 10,
//     flexWrap: 'wrap',
//   },
//   inputButtonContainer: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   container: {
//     flex: 1,
//     marginTop: StatusBar.currentHeight || 0,
//   },
//   item: {
//     backgroundColor: '#A0A0A0',
//     padding: 20,
//     marginVertical: 8,
//     marginHorizontal: 16,
//   },
//   name: {
//     fontSize: 20,
//   },
//   price: {
//     fontSize: 16,
//   },
//   ing: {
//     fontSize: 12,
//   }
// });
