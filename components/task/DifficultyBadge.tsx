import { View, Text, StyleSheet } from "react-native";
import type { TaskDifficulty } from "../../lib/types";

const BADGE_CONFIG: Record<
  TaskDifficulty,
  { bg: string; text: string; label: string }
> = {
  easy: { bg: "#DCFCE7", text: "#16A34A", label: "Easy" },
  medium: { bg: "#FEF3C7", text: "#D97706", label: "Medium" },
  hard: { bg: "#FEE2E2", text: "#DC2626", label: "Hard" },
};

interface DifficultyBadgeProps {
  difficulty: TaskDifficulty;
  size?: "sm" | "md";
}

export default function DifficultyBadge({
  difficulty,
  size = "sm",
}: DifficultyBadgeProps) {
  const config = BADGE_CONFIG[difficulty];
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isSmall ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: config.text },
          isSmall ? styles.textSm : styles.textMd,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontWeight: "700",
    textTransform: "uppercase",
  },
  textSm: {
    fontSize: 10,
  },
  textMd: {
    fontSize: 12,
  },
});
