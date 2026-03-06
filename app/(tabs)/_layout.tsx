import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type TabIconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E2E8F0",
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
        headerStyle: { backgroundColor: "#0F172A" },
        headerTintColor: "#F8FAFC",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: "Record",
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="videocam-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
