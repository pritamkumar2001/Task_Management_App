import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

const ListItems = ({ todos, setTodos, handleTriggerEdit, navigation }) => {
    const [swipedRow, setSwipedRow] = useState(null);

    // Handle task deletion
    const handleDeleteTodo = (rowMap, rowKey) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                { 
                    text: 'Delete', 
                    onPress: () => {
                        const newTodos = todos.filter(todo => todo.key !== rowKey);
                        setTodos(newTodos);
                    }
                }
            ]
        );
    };

    // Toggle task completion status
    const handleMarkComplete = (rowKey) => {
        const newTodos = todos.map(todo => {
            if (todo.key === rowKey) {
                return {
                    ...todo, 
                    status: todo.status === 'Complete' ? 'Pending' : 'Complete',
                    completed: !todo.completed
                };
            }
            return todo;
        });
        setTodos(newTodos);
    };

    // Render status tag with appropriate colors
    const renderStatusTag = (status) => {
        const statusConfig = {
            complete: { bgColor: '#e8f9f0', textColor: '#17c27b' },
            pending: { bgColor: '#fff8e8', textColor: '#ffb840' },
            todo: { bgColor: '#ffe8e8', textColor: '#ff5a5a' },
            planned: { bgColor: '#ffe8e8', textColor: '#ff5a5a' },
            default: { bgColor: '#ffffff', textColor: '#000000' }
        };

        const config = statusConfig[status.toLowerCase()] || statusConfig.default;
        
        return (
            <View style={[styles.statusTag, { backgroundColor: config.bgColor }]}>
                <Text style={[styles.statusText, { color: config.textColor }]}>
                    {status}
                </Text>
            </View>
        );
    };

    // Render each task card
    const renderTaskCard = ({ item }) => (
        <TouchableOpacity 
            style={[
                styles.cardContainer,
                item.completed && styles.completedTask
            ]}
            onPress={() => handleTriggerEdit(item)}
            activeOpacity={0.8}
        >
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.category}>{item.category || 'General Task'}</Text>
                    {renderStatusTag(item.status)}
                </View>
                
                <Text 
                    style={[
                        styles.title,
                        item.completed && styles.completedTitle
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {item.title}
                </Text>
                
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Ionicons name="calendar" size={16} color="#9c27b0" />
                        <Text style={styles.detailText}>
                            {item.taskDate || 'No date'}
                        </Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                        <Ionicons name="time" size={16} color="#9c27b0" />
                        <Text style={styles.detailText}>
                            {item.time || 'No time'}
                        </Text>
                    </View>
                    
                    {item.customer && (
                        <View style={styles.detailItem}>
                            <Ionicons name="person" size={16} color="#9c27b0" />
                            <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
                                {item.customer}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    // Render hidden swipe actions
    const renderHiddenActions = (data, rowMap) => (
        <View style={styles.hiddenActionsContainer}>
            <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => handleMarkComplete(data.item.key)}
            >
                <MaterialIcons 
                    name={data.item.completed ? "check-box" : "check-box-outline-blank"} 
                    size={24} 
                    color="white" 
                />
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteTodo(rowMap, data.item.key)}
            >
                <Ionicons name="trash" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SwipeListView 
            data={todos}
            renderItem={renderTaskCard}
            renderHiddenItem={renderHiddenActions}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewRowKey={"1"}
            previewOpenValue={-150}
            previewOpenDelay={3000}
            disableLeftSwipe={false}
            showsVerticalScrollIndicator={false}
            style={styles.listContainer}
            contentContainerStyle={styles.listContentContainer}
            onRowOpen={(rowKey) => setSwipedRow(rowKey)}
            onRowClose={() => setSwipedRow(null)}
            keyExtractor={(item) => item.key}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        width: '100%',
    },
    listContentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    cardContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    completedTask: {
        opacity: 0.8,
        backgroundColor: '#f9f9f9',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    category: {
        color: '#9c27b0',
        fontWeight: '600',
        fontSize: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    detailsContainer: {
        marginTop: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailText: {
        color: '#666',
        marginLeft: 8,
        fontSize: 14,
        flexShrink: 1,
    },
    statusTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    hiddenActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
        marginVertical: 8,
    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: '100%',
    },
    deleteButton: {
        backgroundColor: '#ff5a5a',
    },
    completeButton: {
        backgroundColor: '#17c27b',
    },
});

export default ListItems;