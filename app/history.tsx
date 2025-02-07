import { useEffect, useState } from "react";
import { SafeAreaView, Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { useRouter } from "expo-router";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";
import { initializeApp } from "firebase/app";

export default function HistoryScreen() {
    const [historyData, setHistoryData] = useState([]);
    const router = useRouter();
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const styles = createStyles(theme, colorScheme);
    const firebaseConfig = {
      apiKey: "AIzaSyDwlHViwQSOeC95NeOji7ZdVW4HUHpoOqQ",
      authDomain: "myfitness-8397.firebaseapp.com",
      databaseURL: "https://myfitness-8397-default-rtdb.firebaseio.com",
      projectId: "myfitness-8397",
      storageBucket: "myfitness-8397.firebasestorage.app",
      messagingSenderId: "268436627526",
      appId: "1:268436627526:web:03e72f5878be0718fbaa47",
      measurementId: "G-57FSKW11KZ"
    };
    const app = initializeApp(firebaseConfig);
	  
    useEffect(() => {
        const db = getDatabase(app)
        // const historyRef = ref(db, "/test/history");
        const historyRef = ref(db, "/history");

        onValue(historyRef, (snapshot) => {
            const data = snapshot.val();
            const formattedData = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    formattedData.push({ id: key, ...data[key] });
                }
            }
            setHistoryData(formattedData);
        });
    }, []);

    const handleItemPress = (id) => {
        router.push(`/historyDetails/${id}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>History</Text>
            {historyData.length > 0 ? (
                <FlatList
                    data={historyData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleItemPress(item.id)}>
                            <View style={styles.card}>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.noData}>No history available</Text>
            )}
        </SafeAreaView>
    );
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'black',
        color: 'white' // Original dark background
    },
    date: {
      color: 'white',
      fontSize: 16,
      fontWeight: "200",
      padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'regular',
    color: 'white',
    marginTop: 20,
    padding: 10,
    textAlign: 'center',
    backgroundColor: 'black',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    borderBottomLeftRadius: 15  
},
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black', // Lighter color for contrast
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        borderBottomStartRadius: 50,
        borderBottomEndRadius: 50,
        borderBottomWidth: 1,
        borderColor: 'gray'
    },
    
    });
}
