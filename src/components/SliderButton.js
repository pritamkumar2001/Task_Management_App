import React, { useRef, useState } from "react";
import {
  View,
  Text,
  PanResponder,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const SLIDER_WIDTH = screenWidth * 0.8; // Increased for better usability
const THUMB_SIZE = 50;

const SliderButton = ({ onSlideComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isCompleted,
    onPanResponderMove: (_, gestureState) => {
      if (!isCompleted && gestureState.dx >= 0 && gestureState.dx <= SLIDER_WIDTH - THUMB_SIZE) {
        pan.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (!isCompleted && gestureState.dx >= SLIDER_WIDTH - THUMB_SIZE - 10) {
        Animated.timing(pan, {
          toValue: SLIDER_WIDTH - THUMB_SIZE,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setIsCompleted(true);
          onSlideComplete();
        });
      } else {
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sliderText}>{isCompleted ? "Completed!" : "Slide to Complete"}</Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: pan }],
              backgroundColor: isCompleted ? "#28a745" : "#007bff",
            },
          ]}
          {...panResponder.panHandlers}
        />
        {!isCompleted && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => {
              Animated.timing(pan, {
                toValue: SLIDER_WIDTH - THUMB_SIZE,
                duration: 200,
                useNativeDriver: false,
              }).start(() => {
                setIsCompleted(true);
                onSlideComplete();
              });
            }}
          >
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  track: {
    width: SLIDER_WIDTH,
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 6,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  sliderText: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  completeButton: {
    position: "absolute",
    bottom: -40,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    elevation: 3,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SliderButton;
