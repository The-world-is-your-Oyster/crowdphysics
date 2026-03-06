import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import type { TaskCategory } from "../../lib/types";
import {
  TASK_CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
} from "../../lib/mockTasks";

interface CategoryFilterProps {
  selected: TaskCategory | undefined;
  onSelect: (category: TaskCategory | undefined) => void;
}

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  const isAll = selected === undefined;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* "All" chip */}
      <TouchableOpacity
        style={[styles.chip, isAll && styles.chipActive]}
        onPress={() => onSelect(undefined)}
        activeOpacity={0.7}
      >
        <Text style={[styles.chipText, isAll && styles.chipTextActive]}>
          All
        </Text>
      </TouchableOpacity>

      {/* Category chips */}
      {TASK_CATEGORIES.map((cat) => {
        const active = selected === cat;
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(active ? undefined : cat)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {CATEGORY_EMOJI[cat]} {CATEGORY_LABEL[cat]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
});
