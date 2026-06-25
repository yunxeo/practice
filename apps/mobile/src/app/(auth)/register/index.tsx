import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Colors, Spacing } from '../../../utils/colors';

export default function RegisterStep1Screen() {
  const [form, setForm] = useState({ email: '', nickname: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.includes('@')) e['email'] = '올바른 이메일 형식으로 입력해 주세요.';
    if (form.nickname.length < 2) e['nickname'] = '닉네임은 2자 이상으로 입력해 주세요.';
    if (form.password.length < 8) e['password'] = '비밀번호는 8자 이상으로 입력해 주세요.';
    if (form.password !== form.confirm) e['confirm'] = '비밀번호가 일치하지 않아요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    router.push({
      pathname: '/(auth)/register/university',
      params: { email: form.email, nickname: form.nickname, password: form.password },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>← 뒤로</Text>
          </TouchableOpacity>

          <View style={styles.progressRow}>
            <View style={[styles.step, styles.stepActive]} />
            <View style={styles.step} />
          </View>

          <Text style={styles.title}>계정 만들기</Text>
          <Text style={styles.subtitle}>1/2 — 기본 정보를 입력해 주세요.</Text>

          <View style={styles.form}>
            <Input
              label="이메일"
              value={form.email}
              onChangeText={(v) => set('email', v)}
              placeholder="student@university.ac.kr"
              keyboardType="email-address"
              error={errors['email']}
              leftIcon="mail-outline"
            />
            <Input
              label="닉네임"
              value={form.nickname}
              onChangeText={(v) => set('nickname', v)}
              placeholder="표시될 이름 (2-20자)"
              error={errors['nickname']}
              leftIcon="person-outline"
            />
            <Input
              label="비밀번호"
              value={form.password}
              onChangeText={(v) => set('password', v)}
              placeholder="영문+숫자 8자 이상"
              secureTextEntry
              error={errors['password']}
              leftIcon="lock-closed-outline"
            />
            <Input
              label="비밀번호 확인"
              value={form.confirm}
              onChangeText={(v) => set('confirm', v)}
              placeholder="비밀번호를 다시 입력하세요"
              secureTextEntry
              error={errors['confirm']}
              leftIcon="lock-closed-outline"
            />

            <Button
              label="학교 선택하기"
              onPress={handleNext}
              style={styles.nextBtn}
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: Spacing.xl },
  back: { marginBottom: Spacing.md },
  backText: { fontSize: 15, color: Colors.primary },
  progressRow: { flexDirection: 'row', gap: 4, marginBottom: Spacing.xl },
  step: { flex: 1, height: 4, backgroundColor: Colors.border, borderRadius: 2 },
  stepActive: { backgroundColor: Colors.primary },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.xl },
  form: { gap: 4 },
  nextBtn: { marginTop: Spacing.md },
});
