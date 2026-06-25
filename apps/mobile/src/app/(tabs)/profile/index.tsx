import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../../components/ui/Avatar';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useAuthStore } from '../../../stores/auth.store';
import { Colors, Spacing } from '../../../utils/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert('로그아웃할까요?', '로그아웃하면 다시 로그인이 필요해요.', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>내 프로필</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Avatar uri={user.avatarUrl} fallbackText={user.nickname} size={64} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.nickname}>{user.nickname}</Text>
                <Badge label={user.role === 'admin' ? '관리자' : '학생'} />
              </View>
              <Text style={styles.email}>{user.email}</Text>
              {user.university && (
                <Text style={styles.university}>{user.university.name}</Text>
              )}
            </View>
          </View>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </Card>

        <View style={styles.menuSection}>
          {[
            {
              icon: 'document-text-outline' as const,
              label: '내가 쓴 후기',
              onPress: () => router.push('/(tabs)/profile/reviews'),
            },
            {
              icon: 'create-outline' as const,
              label: '프로필 편집',
              onPress: () => router.push('/(tabs)/profile/settings'),
            },
          ].map(({ icon, label, onPress }) => (
            <TouchableOpacity key={label} style={styles.menuItem} onPress={onPress}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconWrap}>
                  <Ionicons name={icon} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md, paddingHorizontal: Spacing.sm },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  profileCard: { marginBottom: Spacing.md },
  profileRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  nickname: { fontSize: 18, fontWeight: '700', color: Colors.text },
  email: { fontSize: 13, color: Colors.textSecondary },
  university: { fontSize: 13, color: Colors.primary, marginTop: 2 },
  bio: { fontSize: 14, color: Colors.textSecondary, marginTop: Spacing.sm, lineHeight: 20 },
  menuSection: { backgroundColor: Colors.surface, borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  menuIconWrap: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15, color: Colors.text },
});
