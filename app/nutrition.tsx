import { Fontisto } from '@expo/vector-icons';
import { StyleSheet, SafeAreaView, View, Text, Appearance, FlatList, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { data } from '@/data/nutrition';

export default function ContactScreen() {
	const router = useRouter();

	const colorScheme = Appearance.getColorScheme();

	const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

	const imgColor = colorScheme === 'dark' ? 'papayawhip' : '#333';

	const styles = createStyles(theme, colorScheme);

	const getDetails = (id) => {
		// const dietType = type.replace("-","").toLowerCase();
		router.push(`/nutr/${id}`)
	}

	const renderItem = ({item}) => (
		<Pressable
				onPress={() => getDetails(item.id)}
			>
		<View style={styles.dataItem}>
			
				<Text style={styles.dataText}>
					{item.day} - {item.type}
				</Text>
			
		</View>
		</Pressable>
	)
	return (

		<SafeAreaView style={styles.container}>

			<FlatList
				data={data}
				renderItem={renderItem}
				keyExtractor={(data: { id: any; })=>data.id }
				contentContainerStyle={{ flexGrow: 1}}
			/>  

		</SafeAreaView>
	);
}

function createStyles(theme: { text: any; background: any; headerBackground?: string; tint?: string; icon?: string; tabIconDefault?: string; tabIconSelected?: string; }, colorScheme: string | null | undefined) {
	return StyleSheet.create({
		container: {
			backgroundColor: theme.background,
			paddingTop: 0,
			flexGrow: 1
		},
		imgContainer: {
			backgroundColor: colorScheme === 'dark' ? '#353636' : '#D0D0D0',
			height: 250,
		},
		textContainer: {
			backgroundColor: theme.background,
			padding: 12,
		},
		title: {
			color: theme.text,
			fontSize: 24,
			fontWeight: 'bold',
			lineHeight: 32,
			marginBottom: 10,
		},
		textView: {
			marginBottom: 10,
		},
		text: {
			color: theme.text,
			fontSize: 16,
			lineHeight: 24,
		},
		link: {
			textDecorationLine: 'underline',
		},
		dataItem: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 4,
			padding: 30,
			borderTopColor: 'gray',
			borderBottomColor: 'gray',
			borderBottomWidth: 1,
			width: '100%',
			maxWidth: 1024,
			marginHorizontal: 'auto',
			pointerEvents: 'auto'
		},
		dataText: {
			color: 'white',
			flex: 1,
			fontSize: 18,
		}
	});
}