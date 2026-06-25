import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuthStore } from '../../../stores/auth.store';
import { api } from '../../../services/api';
import { UserProfile } from '../../../types';
import { useTheme } from '../../../hooks/useTheme';
import { Spacing } from '../../../utils/colors';

type ThemeMode = 'light' | 'dark' | 'system';

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'light', label: '라이트', icon: 'sunny-outline' },
  { value: 'dark', label: '다크', icon: 'moon-outline' },
  { value: 'system', label: '시스템', icon: 'phone-portrait-outline' },
];

export default function SettingsScreen() {
  const { user, setUser } = useAuthStore();
  const qc = useQueryClient();
  const { colors, mode, setMode } = useTheme();

  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');

  const mutation = useMutation({
    mutationFn: async (data: { nickname: string; bio: string }) => {
      const res = await api.put<{ data: UserProfile }>('/users/me', data);
      return res.data.data;
    },
    onSuccess: (updated) => {
      setUser(updated);
      qc.invalidateQueries({ queryKey: ['my-profile'] });
      Alert.alert('완료', '프로필이 업데이트되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    },
    onError: () => Alert.alert('오류', '프로필 업데이트에 실패했습니다.'),
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>프로필 편집</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Input
            label="닉네임"
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임 (2-20자)"
          />
          <Input
            label="자기소개"
            value={bio}
            onChangeText={setBio}
            placeholder="간단한 자기소개를 입력해주세요 (선택)"
            multiline
            numberOfLines={4}
            style={styles.bioInput}
          />

          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>화면 테마</Text>
            <View style={styles.themeRow}>
              {THEME_OPTIONS.map((opt) => {
                const active = mode === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.themeOption,
                      { borderColor: active ? colors.primary : colors.border },
                      active && { backgroundColor: colors.primary + '15' },
                    ]}
                    onPress={() => setMode(opt.value)}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={active ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[styles.themeLabel, { color: active ? colors.primary : colors.textSecondary }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Button
            label="저장"
            onPress={() => mutation.mutate({ nickname, bio })}
            loading={mutation.isPending}
            size="lg"
            style={styles.saveBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1 },
  title: { fontSize: 16, fontWeight: '700' },
  container: { padding: Spacing.xl },
  bioInput: { height: 100, textAlignVertical: 'top' },
  sectionCard: { borderRadius: 16, padding: Spacing.md, marginBottom: Spacing.md },
  sectionLabel: { fontSize: 15, fontWeight: '600', marginBottom: Spacing.sm },
  themeRow: { flexDirection: 'row', gap: 8 },
  themeOption: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, gap: 4 },
  themeLabel: { fontSize: 12, fontWeight: '500' },
  saveBtn: { marginTop: Spacing.sm },
});
