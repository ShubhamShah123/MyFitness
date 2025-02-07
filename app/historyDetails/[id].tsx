import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";
import { getDatabase, ref, get } from "firebase/database";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";
import { initializeApp } from "firebase/app";

export default function HistoryDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [historyDetail, setHistoryDetail] = useState(null);
    const [sessData, setSessData] = useState(null);
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
    const styles = createStyles(theme, colorScheme);

    // Firebase initialization (done once)
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
    
    initializeApp(firebaseConfig); // Initialize Firebase only once

    useEffect(() => {
        const db = getDatabase(); // Initialize the database once for use in the hook
        const historyRef = ref(db, `history/${id}`);
        // const historyRef = ref(db, `/test/history/${id}`);

        get(historyRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const historyData = snapshot.val();
                    const sessId = historyData['sessionId'];
                    // const sessRef = ref(db, `/test/session/${sessId}`);
                    const sessRef = ref(db, `/session/${sessId}`)
                    
                    // Fetch session data if sessionId exists
                    get(sessRef)
                        .then((sess_snapshot) => {
                            if (sess_snapshot.exists()) {
                                const sessData = sess_snapshot.val();
                                setSessData(sessData);
                            } else {
                                console.log("No session data available");
                            }
                        });

                    setHistoryDetail(historyData); // Store history details
                } else {
                    console.log("No data available for this history ID");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [id]); // Run effect when `id` changes

    if (!historyDetail || !sessData) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: '#151718' }}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>{historyDetail.date}</Text>
                <Text style={[styles.title, styles.title2]}>Nutrition</Text>
                <Text style={styles.subTitle}>Pre-workout: {historyDetail.preWorkout}</Text>
                <Text style={styles.subTitle}>Workout: {historyDetail.workout}</Text>
                <Text style={styles.subTitle}>Breakfast: {historyDetail.breakfast}</Text>
                <Text style={styles.subTitle}>Lunch: {historyDetail.lunch}</Text>
                <Text style={styles.subTitle}>Snack: {historyDetail.snack}</Text>
                <Text style={styles.subTitle}>Dinner: {historyDetail.dinner}</Text>

                <Text style={[styles.title, styles.title2]}>Measurements</Text>
                <Text style={styles.subTitle}>Weight: {historyDetail.weight} kgs</Text>
                <Text style={styles.subTitle}>Waist: {historyDetail.waist} cm</Text>
                <Text style={styles.subTitle}>Stomach: {historyDetail.stomach} cm</Text>
                <Text style={styles.subTitle}>Hip: {historyDetail.hip} cm</Text>
                <Text style={styles.subTitle}>Thigh: {historyDetail.thigh} cm</Text>

                <Text style={[styles.title, styles.title2]}>Session</Text>
                <Text style={styles.subTitle}>Name: {sessData.name}</Text>
                <Text style={styles.subTitle}>Time taken: {sessData.totalTimeTaken}</Text>
                {sessData.exercise && Object.entries(sessData.exercise).map(([name, status]) => (
                    <Text style={styles.subTitle} key={name}>
                        {name}: {status}
                    </Text>
                ))}
            </SafeAreaView>
        </ScrollView>
    );
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.background,
        },
        title: {
            fontSize: 24,
            fontWeight: 100,
            color: 'white',
            marginTop: 20,
            padding: 10,
            textAlign: 'center',
            backgroundColor: theme.background,
            borderBottomColor: 'gray',
            borderBottomWidth: 0.5,
            borderBottomLeftRadius: 15
        },
        title2: {
            fontSize: 22,
            marginTop: 5,
            borderBottomRightRadius: 25,
            borderBottomLeftRadius: 25,
        },
        subTitle: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "100",
            marginVertical: 5,
            marginTop: 10,
            marginLeft: 20,
            marginRight: 20,
            backgroundColor: theme.background,
            padding: 10,
            borderBottomColor: 'gray',
            borderBottomWidth: 0.2,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
        },
    });
}
