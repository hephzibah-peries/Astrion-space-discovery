import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useAuth } from '../features/auth/context/AuthContext';
import { TabScreenProps } from '../navigation/navigation.types';
import { ApodItem, ApodState } from '../features/home/types/apod.types';
import { nasaApi } from '../features/home/services/nasaApi';
import { HomeHeader } from '../features/home/components/HomeHeader';
import { ApodCard } from '../features/home/components/ApodCard';
import { ApodLoadingState } from '../features/home/components/ApodLoadingState';
import { ApodErrorState } from '../features/home/components/ApodErrorState';
import { DiscoverSpaceSection } from '../features/home/components/DiscoverSpaceSection';

export const HomeScreen: React.FC<TabScreenProps<'Home'>> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const [state, setState] = useState<ApodState>({
    data: null,
    isLoading: true,
    error: null,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadApod = useCallback(async (forceRefresh = false) => {
    try {
      setState((prev) => ({
        ...prev,
        isLoading: !forceRefresh && prev.data === null,
        error: null,
      }));

      const apod = await nasaApi.fetchTodayApod(forceRefresh);

      setState({
        data: apod,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setState((prev) => ({
          data: prev.data, // preserve stale data if refresh fails
          isLoading: false,
          error: err.message || 'Unable to load Astronomy Picture of the Day.',
        }));
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadApod(false);
    return () => {
      controller.abort();
    };
  }, [loadApod]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadApod(true);
    setIsRefreshing(false);
  };

  const handleViewDetails = (itemId: string) => {
    navigation.navigate('Details', { itemId });
  };

  const handleLogout = () => {
    Alert.alert(
      'Terminate Mission Session',
      'Are you sure you want to sign out of ASTRION? Your secure session will be cleared from Expo SecureStore.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header with User Info & Status */}
        <HomeHeader user={user} />

        {/* Astronomy Picture of the Day (Featured Section) */}
        {state.isLoading && <ApodLoadingState />}

        {!state.isLoading && state.error && (
          <ApodErrorState
            message={state.error}
            onRetry={() => loadApod(true)}
            isRetrying={state.isLoading}
          />
        )}

        {!state.isLoading && state.data && (
          <ApodCard item={state.data} onViewDetails={handleViewDetails} />
        )}

        {/* Discover Space Section */}
        <DiscoverSpaceSection
          currentApod={state.data}
          onExploreApod={handleViewDetails}
        />

        {/* Sign Out Action Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Sign Out of Mission Control</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#F87171',
    fontSize: 14,
    fontWeight: '700',
  },
});
