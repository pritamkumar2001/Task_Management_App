import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';
import CardItem from '../components/old_components/CardItem';
import { getCompanyInfo, getProfileInfo } from '../services/authServices';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { getActivityList, getUserTasks } from '../services/productServices';
import Loader from '../components/old_components/Loader';
import { ButtonGroup } from '@rneui/themed';
import BottomSheetModal from '../components/BottomSheetModal';

const { width } = Dimensions.get('window');

const Container = styled.View`
  background-color: #f5f5f5;
`;

const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#ffd6b3', '#f7dce0'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  align-items: center;
  height: 100%;
`;

const CompanyContainer = styled.View`
  flex-direction: row;
  width: 100%;
  padding: 10px;
  background-color: #fb9032;
  align-items: center;
  gap: 20px;
`;

const CompanyTextContainer = styled.View`
  display: flex;
  align-items: flex-start;
`;

const CompanyName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin: 10px 0;
  color: #333333;
`;

const SubHeader = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  color: #555555;
`;

const LogoContainer = styled.View`
  width: ${width * 0.2}px;
  height: ${width * 0.2}px;
  background-color: #ffffff;
  border-radius: ${width * 0.25}px;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  margin-top: 5%;
`;

const Logo = styled.Image.attrs(() => ({
  resizeMode: 'contain',
}))`
  width: 95%;
  height: 95%;
  border-radius: ${width * 0.35}px;
`;

const ProfileTextContainer = styled.View`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const HomePage = ({ navigation }) => {
  const route = useRoute();
  const { userToken } = useContext(AppContext);
  const [company, setCompany] = useState({});
  const [profile, setProfile] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (route?.params?.refresh) {
      fetchTasks(selectedIndex);
    }
  }, [route?.params?.refresh]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companyRes, profileRes, activityRes] = await Promise.all([
        getCompanyInfo(),
        getProfileInfo(),
        getActivityList(),
      ]);
      setCompany(companyRes.data);
      setProfile(profileRes.data);
      setActivities(activityRes.data?.a_list || []);
      fetchTasks(selectedIndex);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchTasks = async (index) => {
    if (!route?.name) return; // Ensure route name exists

    let taskType = 'ALL'; // Default case

    if (index === 0) taskType = route.name === 'MTaskScreen' ? 'MANAGER_M0' : 'D0'; // Today
    else if (index === 1) taskType = route.name === 'MTaskScreen' ? 'MANAGER_M3' : 'D3'; // Next 3 Days
    else if (index === 2) taskType = route.name === 'MTaskScreen' ? 'MANAGER_PAST' : 'PAST'; // Past Tasks
    else if (index === 3) taskType = route.name === 'MTaskScreen' ? 'MANAGER_ALL' : 'ALL'; // All Tasks

    setLoading(true);
    try {
      const res = await getUserTasks(taskType, '', '');
      setFilterData(res.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const handleIconPress = () => {
    console.log('Icon Pressed');
  };

  const handleIconName1Press = () => {
    console.log('Icon Name 1 Pressed');
  };

  const handleSelectTaskType = (selectedOption) => {
    let newIndex = 0; // Default to 'TODAY'

    if (selectedOption === 'NEXT 3') newIndex = 1;
    else if (selectedOption === 'PAST') newIndex = 2;
    else if (selectedOption === 'ALL') newIndex = 3;

    setSelectedIndex(newIndex); // Update selected index
    fetchTasks(newIndex); // Fetch tasks based on selection
    setDateModalVisible(false);
  };

  const handleSelectStatus = (status) => {
    console.log('Selected Status:', status);
    setStatusModalVisible(false);
  };

  console.log('Profile===',profile);

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="rgb(252, 128, 20)" />
      <GradientBackground>
        <Loader visible={loading} />
        <CompanyContainer>
          <LogoContainer>
            <Logo source={{ uri: company.image || 'https://home.atomwalk.com/static/media/Atom_walk_logo-removebg-preview.21661b59140f92dd7ced.png' }} />
          </LogoContainer>
          <CompanyTextContainer>
            <CompanyName>{company.name || 'Atomwalk Technologies'}</CompanyName>
            <SubHeader>Welcome to Atomwalk Office!</SubHeader>
          </CompanyTextContainer>
        </CompanyContainer>

        <ProfileTextContainer>
          <CompanyName>My Tasks</CompanyName>
        </ProfileTextContainer>

        <ButtonGroup
          buttons={['Days', 'Status']}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            if (value === 0) {
              setDateModalVisible(true); // Open Date Selection Modal
            } else {
              setStatusModalVisible(true); // Open Status Selection Modal
            }
          }}
          buttonStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#454545',
            borderWidth: 1,
            borderRadius: 25,
          }}
          containerStyle={{
            marginBottom: 10,
            marginHorizontal: 10,
            backgroundColor: 'transparent',
            borderWidth: 0,
            gap: 1,
          }}
          selectedButtonStyle={{ backgroundColor: '#4491FE' }}
          buttonContainerStyle={{ borderColor: 'transparent', borderWidth: 0 }}
        />

        <View style={{ zIndex: 0 }}>
          <FlatList
            data={filterData}
            renderItem={({ item }) => (
              <CardItem
                data={item}
                navigation={navigation}
                colour={'#4491FE'}
                icon="assignment-ind"
                handleIconPress={handleIconPress}
                handleDisplayPress={() => {}}
                buttonTittle="Product Interest"
                screen="TaskInterest"
                iconName1="preview"
                handleIconName1Press={handleIconName1Press}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </GradientBackground>

      {/* Task Date Selection Modal */}
      <BottomSheetModal
        visible={isDateModalVisible}
        options={['TODAY', 'NEXT 3', 'PAST', 'ALL']}
        onSelect={handleSelectTaskType}
        onClose={() => setDateModalVisible(false)}
      />

      {/* Task Status Selection Modal */}
      <BottomSheetModal
        visible={isStatusModalVisible}
        options={['Planned', 'Completed']}
        onSelect={handleSelectStatus}
        onClose={() => setStatusModalVisible(false)}
      />
    </Container>
  );
};

export default HomePage;