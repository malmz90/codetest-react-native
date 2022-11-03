import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Search from '../screens/Search';
import ShowDetails from '../screens/ShowDetails';
const screens = {
	Search: {
		screen: Search,
	},
	ShowDetails: {
		screen: ShowDetails,
	},
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
