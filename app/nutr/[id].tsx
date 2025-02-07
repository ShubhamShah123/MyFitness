import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { data } from '@/data/nutrition';
import { SafeAreaView } from "react-native-safe-area-context";

export default function NutritionScreen() {
    const { id } = useLocalSearchParams();
    
    // Find the selected meal plan by id
    const mealPlan = data.find(item => item.id.toString() === id);
    
    if (!mealPlan) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Meal Plan not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{mealPlan.day}: {mealPlan.type} Plan</Text>

            {mealPlan.details.length > 0 ? (
                <FlatList
                    data={mealPlan.details}
                    keyExtractor={(item) => item.meal_num.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.mealNumber}>{item.meal_num}</Text>
                            <View style={styles.textContainer}>
                                <Text style={styles.mealType}>{item.meal_type}</Text>
                                <Text style={styles.mealName}>{item.meal_name}</Text>
                                {item.recipe.length > 0 ? (
                                    <FlatList
                                        data={item.recipe}
                                        keyExtractor={(recipeItem, index) => index.toString()}
                                        renderItem={({ item: recipeItem }) => (
                                            <Text style={styles.recipeItem}>- {recipeItem}</Text>
                                        )}
                                    />
                                ) : (
                                    <Text style={styles.noRecipe}>No recipe available</Text>
                                )}
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noDetails}>No meal details available</Text>
            )}
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
    mealNumber: {
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
    mealType: {
        color: 'gray',
        fontSize: 14,
        fontWeight: 'bold',
    },
    mealName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    recipeItem: {
        color: 'gray',
        fontSize: 14,
        marginLeft: 10,
    },
    noRecipe: {
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
