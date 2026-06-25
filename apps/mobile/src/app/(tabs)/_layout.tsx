import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../utils/colors';

type IoniconsName = keyof typeof Ionicons.glyphMap;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          borderTopColor: Colors.border,
          backgroundColor: Colors.surface,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={(focused ? 'home' : 'home-outline') as IoniconsName} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '탐색',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={(focused ? 'compass' : 'compass-outline') as IoniconsName} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: '내 프로필',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={(focused ? 'person' : 'person-outline') as IoniconsName} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
