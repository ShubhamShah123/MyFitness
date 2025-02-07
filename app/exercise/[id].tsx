import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { data } from '@/data/workoutSchedule';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseScreen() {
    const { id } = useLocalSearchParams();
    
    // Find the selected workout by id
    const workout = data.find(item => item.id.toString() === id);

    if (!workout) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Workout not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{workout.day}: {workout.name}</Text>

            {workout.details ? (
                <FlatList
                    data={workout.details}
                    keyExtractor={(item) => item.num}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer} // Ensures full display
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cellNumber}>{item.num}</Text>
                            <View style={styles.textContainer}>
                                <Text style={styles.cellText}>{item.name}</Text>
                                <Text style={styles.cellSubText}>Sets: {item.sets} | Reps: {item.reps}</Text>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noDetails}>No workout details available</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'black', // Original dark background
    },
    title: {
        fontSize: 20,
        fontWeight: 'regular',
        color: 'white', // Keeping your original color scheme
        marginBottom: 16,
        textAlign: 'center',
        backgroundColor: 'black',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        borderBottomLeftRadius: 15

    },
    listContainer: {
        paddingBottom: 20, // Fixes last item being cut off
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black', // Lighter color for contrast
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
        color: 'white', // Dark text for better readability
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
        fontWeight: '500',
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
    }
});
