import React, { useRef, useState } from 'react';
import { StyleSheet, Animated, View, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from './TaskCard';

const SwipeableTaskCard = ({ task, onMarkComplete }) => {
  const swipeableRef = useRef(null);
  const [taskCardHeight, setTaskCardHeight] = useState(null);
  const borderRadius = 10; // Ensuring consistent borderRadius

  const handleSwipeableOpen = () => {
    if (onMarkComplete) {
      onMarkComplete(task.id);
      swipeableRef.current?.close();
    }
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.rightAction,
          {
            height: taskCardHeight, // Match TaskCard height
            borderRadius: borderRadius, // Match TaskCard borderRadius
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <View style={styles.completeButton}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={24} color="#9c27b0" />
          </View>
          <Text style={styles.completeText}>Mark Complete</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setTaskCardHeight(height);
      }}
    >
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleSwipeableOpen}
        rightThreshold={10}
      >
        {/* Ensure TaskCard is wrapped to measure its height */}
        <View
          style={{ borderRadius: borderRadius, overflow: 'hidden' }} // Ensures rounded corners
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setTaskCardHeight(height);
          }}
        >
          <TaskCard
            category={task.category}
            title={task.title}
            startDate={task.startDate}
            endDate={task.endDate}
            status={task.status}
          />
        </View>
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    backgroundColor: '#f8f0fa',
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Will be overridden dynamically
  },
  completeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#9c27b0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completeText: {
    color: '#9c27b0',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SwipeableTaskCard;
