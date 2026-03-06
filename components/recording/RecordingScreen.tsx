import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { RECORDING } from "../../lib/constants";
import type { CameraFacing } from "../../hooks/useRecording";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface RecordingScreenProps {
  taskTitle: string;
  isRecording: boolean;
  isCountingDown: boolean;
  countdown: number;
  elapsedSeconds: number;
  formattedTime: string;
  durationProgress: number;
  isUnderMinDuration: boolean;
  cameraFacing: CameraFacing;
  cameraRef: React.RefObject<CameraView | null>;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSwitchCamera: () => void;
}

export function RecordingScreen({
  taskTitle,
  isRecording,
  isCountingDown,
  countdown,
  elapsedSeconds,
  formattedTime,
  durationProgress,
  isUnderMinDuration,
  cameraFacing,
  cameraRef,
  onStartRecording,
  onStopRecording,
  onSwitchCamera,
}: RecordingScreenProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  // Countdown animation
  const countdownScale = useRef(new Animated.Value(1)).current;
  const countdownOpacity = useRef(new Animated.Value(1)).current;

  // Pulse animation for record indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (countdown > 0) {
      countdownScale.setValue(0.3);
      countdownOpacity.setValue(1);
      Animated.parallel([
        Animated.spring(countdownScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(countdownOpacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [countdown, countdownScale, countdownOpacity]);

  // Pulse animation while recording
  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  // Handle permissions
  if (!cameraPermission || !micPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#94A3B8" />
        <Text style={styles.permissionTitle}>Camera & Microphone Access</Text>
        <Text style={styles.permissionText}>
          CrowdPhysics needs access to your camera and microphone to record task
          videos.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            await requestCameraPermission();
            await requestMicPermission();
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine progress bar color
  const progressColor = isUnderMinDuration ? "#F59E0B" : "#22C55E";
  const minDurationProgress = RECORDING.MIN_DURATION_SEC / RECORDING.MAX_DURATION_SEC;

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraFacing}
        mode="video"
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.taskBadge}>
            <Text style={styles.taskBadgeText} numberOfLines={1}>
              {taskTitle}
            </Text>
          </View>
          <View style={styles.timerContainer}>
            {isRecording && (
              <Animated.View
                style={[
                  styles.recordingDot,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
            )}
            <Text style={styles.timerText}>{formattedTime}</Text>
          </View>
        </View>

        {/* Camera Toggle */}
        {!isRecording && !isCountingDown && (
          <TouchableOpacity
            style={styles.cameraToggle}
            onPress={onSwitchCamera}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-reverse-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Guide Overlay */}
        <View style={styles.guideOverlay}>
          <View style={styles.guideBox}>
            <Text style={styles.guideText}>Keep hands in this area</Text>
          </View>
        </View>

        {/* Countdown Overlay */}
        {isCountingDown && countdown > 0 && (
          <View style={styles.countdownOverlay}>
            <Animated.Text
              style={[
                styles.countdownText,
                {
                  transform: [{ scale: countdownScale }],
                  opacity: countdownOpacity,
                },
              ]}
            >
              {countdown}
            </Animated.Text>
          </View>
        )}

        {/* "GO!" flash when countdown reaches 0 and recording starts */}
        {isCountingDown && countdown === 0 && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.goText}>GO!</Text>
          </View>
        )}

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          {/* Min duration marker */}
          <View
            style={[
              styles.minMarker,
              { left: `${minDurationProgress * 100}%` },
            ]}
          />
          {/* Progress fill */}
          <View
            style={[
              styles.progressFill,
              {
                width: `${durationProgress * 100}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>

        {/* Duration labels */}
        <View style={styles.durationLabels}>
          <Text style={styles.durationLabel}>0:00</Text>
          <Text style={styles.durationLabel}>
            Min {Math.floor(RECORDING.MIN_DURATION_SEC / 60)}:
            {(RECORDING.MIN_DURATION_SEC % 60).toString().padStart(2, "0")}
          </Text>
          <Text style={styles.durationLabel}>
            Max {Math.floor(RECORDING.MAX_DURATION_SEC / 60)}:
            {(RECORDING.MAX_DURATION_SEC % 60).toString().padStart(2, "0")}
          </Text>
        </View>
      </CameraView>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive,
          ]}
          onPress={isRecording ? onStopRecording : onStartRecording}
          disabled={isCountingDown}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonInnerActive,
            ]}
          >
            {isRecording ? (
              <View style={styles.stopSquare} />
            ) : (
              <View style={styles.recordDot} />
            )}
          </View>
        </TouchableOpacity>

        {isRecording && (
          <Text style={styles.tapToStopText}>Tap to stop recording</Text>
        )}
        {!isRecording && !isCountingDown && (
          <Text style={styles.tapToStopText}>Tap to start recording</Text>
        )}
        {isCountingDown && (
          <Text style={styles.tapToStopText}>Get ready...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },

  // Permission screens
  permissionContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F8FAFC",
    textAlign: "center",
  },
  permissionText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  taskBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: SCREEN_WIDTH * 0.5,
  },
  taskBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
  },

  // Camera toggle
  cameraToggle: {
    position: "absolute",
    top: 56,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 48,
  },

  // Guide overlay
  guideOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  guideBox: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.5,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 16,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  guideText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },

  // Countdown overlay
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  countdownText: {
    fontSize: 120,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  goText: {
    fontSize: 72,
    fontWeight: "900",
    color: "#22C55E",
  },

  // Progress bar
  progressContainer: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 16,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  minMarker: {
    position: "absolute",
    top: -2,
    width: 2,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 1,
  },
  durationLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  durationLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },

  // Controls
  controls: {
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: "#000000",
  },
  recordButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  recordButtonActive: {
    borderColor: "#EF4444",
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  recordButtonInnerActive: {
    backgroundColor: "transparent",
  },
  recordDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  stopSquare: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  tapToStopText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 10,
    fontWeight: "500",
  },
});
