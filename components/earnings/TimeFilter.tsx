import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { TimeFilter as TimeFilterType } from "../../hooks/useEarnings";

interface TimeFilterProps {
  active: TimeFilterType;
  onChange: (filter: TimeFilterType) => void;
}

const FILTERS: { key: TimeFilterType; label: string }[] = [
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "all", label: "All Time" },
];

export default function TimeFilter({ active, onChange }: TimeFilterProps) {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const isActive = active === filter.key;
        return (
          <TouchableOpacity
            key={filter.key}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onChange(filter.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },
  pillActive: {
    backgroundColor: "#0F172A",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
});
