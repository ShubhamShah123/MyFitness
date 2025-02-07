import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, StyleSheet, FlatList, Pressable, AppState, Alert, Modal } from "react-native";
import { data } from '@/data/workoutSchedule';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, push, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { format } from "date-fns";

export default function SessionScreen() {
    const { id } = useLocalSearchParams();
    const [checkedItems, setCheckedItems] = useState({});
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const appState = useRef(AppState.currentState);

    const workout = data.find(item => item.id.toString() === id);
    const router = useRouter();
    
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
    const db = getDatabase(app);

    useEffect(() => {
        const loadTimer = async () => {
            const storedStartTime = await AsyncStorage.getItem("sessionStartTime");
            if (storedStartTime) {
                const startTime = parseInt(storedStartTime);
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setTimer(elapsed);
                setIsRunning(true);
            }
        };
        loadTimer();

        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                loadTimer();
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimer(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const toggleCheckbox = (num) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [num]: !prevState[num]
        }));
    };

    const startSession = async () => {
        const startTime = Date.now();
        await AsyncStorage.setItem("sessionStartTime", startTime.toString());
        setTimer(0);
        setIsRunning(true);
    };

    const submitSession = async () => {
        console.log("Submit Session")
        setIsRunning(false);
        await AsyncStorage.removeItem("sessionStartTime");

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
        const today_new = format(new Date(), "MMM dd, yyyy");

        

        const sessionData = {
            date: formattedDate,
            day: workout.day,
            name: workout?.name,
            exercise: workout.details.reduce((acc, item) => {
                acc[item.name] = checkedItems[item.num] ? "Done" : "Not Done";
                return acc;
            }, {}),
            totalTimeTaken: `${Math.floor(timer / 60)} min ${timer % 60} sec`
        };

        console.log(sessionData);
        const newSession = push(ref(db, '/session'))
        const newHist = ref(db, '/history')
        // const newSession = push(ref(db, '/test/session'))
        // const newHist = ref(db, '/test/history')
        set(newSession, sessionData)
        .then(() => {
            console.log("Session data added! -> "+ newSession.key)
            const histData = {
                date: today_new,
                preWorkout: "",
                workout: "",
                breakfast: "",
                lunch: "",
                snack: "",
                dinner: "",
                weight: "",
                waist: "",
                stomach: "",
                hip: "",
                thigh: "",
                sessionId: newSession.key
            }
            push(newHist, histData)
            .then(() => {
                console.log("History Data added!")
            })

            // Custom Modal Section
            setModalVisible(true)
        })
    };

    if (!workout) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Workout not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{workout.day}: {isRunning ? `${Math.floor(timer / 60)}m ${timer % 60}s` : ""}</Text>

            {workout.details ? (
                <FlatList
                    data={workout.details}
                    keyExtractor={(item) => item.num}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cellNumber}>{item.num}</Text>
                            <View style={styles.textContainer}>
                                <Text style={styles.cellText}>{item.name}</Text>
                                <Text style={styles.cellSubText}>Sets: {item.sets} | Reps: {item.reps}</Text>
                            </View>
                            <Pressable onPress={() => toggleCheckbox(item.num)} style={styles.checkboxContainer}>
                                <Ionicons 
                                    name={checkedItems[item.num] ? "checkbox-outline" : "square-outline"} 
                                    size={24} 
                                    color="white" 
                                />
                            </Pressable>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noDetails}>No workout details available</Text>
            )}
            
            <Pressable style={styles.submitButton} onPress={startSession}>
                <Text style={styles.submitText}>Start</Text>
            </Pressable>
            <Pressable style={styles.submitButton} onPress={submitSession}>
                <Text style={styles.submitText}>Submit</Text>
            </Pressable>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Session Uploaded!</Text>
                        <Pressable style={[styles.submitButton, styles.modalButton]} onPress={() => {
                            setModalVisible(false)
                            router.push('/')
                        }}>
                            <Text style={styles.submitText}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'black',
    },
    title: {
        fontSize: 20,
        fontWeight: 'regular',
        color: 'white',
        marginBottom: 16,
        textAlign: 'center',
        backgroundColor: 'black',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        borderBottomLeftRadius: 15
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        borderColor: 'white'
    },
    cellNumber: {
        fontSize: 18,
        fontWeight: 'regular',
        color: 'white',
        width: 40,
        textAlign: 'center',
    },
    textContainer: {
        flex: 1,
        paddingLeft: 10,
    },
    cellText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '200',
    },
    cellSubText: {
        color: 'gray',
        fontSize: 14,
        marginTop: 4,
    },
    noDetails: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 20,
    },
    submitButton: {
        borderColor: 'white',
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    submitText: {
        color: "white",
        fontSize: 18,
        fontWeight: "100",
    },
    checkboxContainer: {
        padding: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        
    },
    modalContent: {
        backgroundColor: "black",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: 'white',
    },
    modalText: {
        color: "white",
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '100'
    },
    modalButton: {
        backgroundColor: '#111',
        borderColor: '#333'
    }
});
