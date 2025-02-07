import { useState, useEffect } from "react";
import { Fontisto } from "@expo/vector-icons";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Appearance,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Modal
} from "react-native";

import { Colors } from "@/constants/Colors";
import { format } from "date-fns";
import { RadioButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import { get, getDatabase, push, ref, set, update } from "firebase/database";
import { data } from "@/data/workoutSchedule"; 


export default function HealthTrackerScreen() {
	useEffect(() => {
		const fetchHistory = async () => {
			let histRef = ref(db, '/history'); // Change to /test/history
			let histData = await get(histRef);
			let histDataVal = histData.val();
	
			if (histDataVal) {
				for (const [key, value] of Object.entries(histDataVal)) {
					if (value.date === today_new) {
						setResponses((prevResponses) => ({
							...prevResponses,
							preWorkout: value.preWorkout || "",
							workout: value.workout || "",
							breakfast: value.breakfast || "",
							lunch: value.lunch || "",
							snack: value.snack || "",
							dinner: value.dinner || "",
						}));
						break;
					}
				}
			}
		};
	
		fetchHistory();
	}, []);
	const colorScheme = Appearance.getColorScheme();
	const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
	const styles = createStyles(theme, colorScheme);
	const today = format(new Date(), "EEEE, MMM dd, yyyy");
	const today_new = format(new Date(), "MMM dd, yyyy");
	const today_day = format(new Date(), "EEEE");
	const currentDate = new Date();
	const formattedDate = currentDate.toISOString().split("T")[0];
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
	const db = getDatabase(app)
	const [modalVisible, setModalVisible] = useState(false);
	const [responses, setResponses] = useState({
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
		sessionId: ""
	});

	const handleInputChange = (field, value) => {
		setResponses({ ...responses, [field]: value });
	};

	const handleSelectionChange = (field, value) => {
		setResponses({ ...responses, [field]: value });
	};
	const handleSubmit = async () => {
		let histRef = ref(db, '/history') // Change to /test/history
		let histData = await get(histRef)
		let histDataVal = histData.val()
		let sessId = null;
		for (const[key, value] of Object.entries(histDataVal)) {
			console.log(key, value, value.date, typeof(value))
			console.log("-----------------")
			if (value.date === today_new){
				responses.sessionId = value.sessionId
				break;
			}
		}

		let historyRef = ref(db, '/history') // Change to /test/history
		let histResp = await get(historyRef);
		let histResponse = histResp.val();
		
		let histKey = null;
		if (histResponse) {
			for (let [key, value] of Object.entries(histResponse)) {
				if (value.date === today_new) {
					histKey = key;
					break;
				}
			}
		} else {
			console.log("No history data found.");
		}
		
		let existingHistoryRef = ref(db, `/history/${histKey}`);
		// let existingHistoryRef = ref(db, `/test/history/${histKey}`);
		
		update(existingHistoryRef, responses)
		.then(() => console.log("History Updated Sucessfully!"))

		setModalVisible(true)
	};
	

	const categories = [
	{ key: "preWorkout", label: "Pre-workout" },
	{ key: "workout", label: "Workout" },
	{ key: "breakfast", label: "Breakfast" },
	{ key: "lunch", label: "Lunch" },
	{ key: "snack", label: "Snack" },
	{ key: "dinner", label: "Dinner" },
	];

	const measurements = [
	{ key: "weight", label: "Weight" },
	{ key: "waist", label: "Waist" },
	{ key: "stomach", label: "Stomach" },
	{ key: "hip", label: "Hip" },
	{ key: "thigh", label: "Thigh" },
	];

	return (
	<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
		<ScrollView
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={false}
		>
			<SafeAreaView style={styles.container}>
			<Text style={styles.title}>{today}</Text>

			{categories.map((item) => (
				<View key={item.key} style={styles.inputContainer}>
				<Text style={styles.label}>{item.label}</Text>
				<RadioButton.Group
					onValueChange={(value) =>
					handleSelectionChange(item.key, value)
					}
					value={responses[item.key]}
				>
					<View style={styles.radioOption}>
					<RadioButton value="taken" />
					<Text style={styles.radioText}>Taken</Text>
					<RadioButton value="missed" />
					<Text style={styles.radioText}>Missed</Text>
					</View>
				</RadioButton.Group>
				</View>
			))}

			<Text style={styles.subTitle}>Measurements: Do this at end of everyweek</Text>
			{measurements.map((item) => (
				<View key={item.key} style={styles.inputContainer}>
				<Text style={styles.label}>{item.label}</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter value"
					placeholderTextColor={"gray"}
					keyboardType="numeric"
					onChangeText={(text) => handleInputChange(item.key, text)}
					value={responses[item.key]}
				/>
				</View>
			))}

			<Pressable style={styles.submitButton} onPress={handleSubmit}>
				<Text style={styles.submitText}>Submit</Text>
			</Pressable>
			<Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>History Updated Sucessfully!</Text>
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
		</ScrollView>
		</TouchableWithoutFeedback>
	</KeyboardAvoidingView>
);
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
	container: {
	  backgroundColor: theme.background,
	  flex: 1,
	  padding: StatusBar.currentHeight,
	},
	title: {
	  color: theme.text,
	  fontSize: 24,
	  fontWeight: "regular",
	  textAlign: "center",
	  marginBottom: 20,
	  marginTop: 20,
	},
	subTitle: {
	  color: theme.text,
	  fontSize: 20,
	  fontWeight: "bold",
	  marginTop: 20,
	},
	inputContainer: {
	  marginVertical: 10,
	},
	label: {
	  color: theme.text,
	  fontSize: 16,
	  marginBottom: 5,
	},
	input: {
	  // backgroundColor: colorScheme === 'dark' ? '#353636' : '#D0D0D0',
	  color: "white",
	  padding: 10,
	  borderRadius: 5,
	  borderColor: "white",
	  borderWidth: 1,
	},
	submitButton: {
	  backgroundColor: colorScheme === "dark" ? "#444" : "#007AFF",
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
	radioOption: {
	  flexDirection: "row",
	  alignItems: "center",
	},
	radioText: {
	  color: theme.text,
	  marginRight: 10,
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
        borderColor: '#333',
		borderWidth: 1
    }
  });
}
