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
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../stores/auth.store';
import { Colors, Spacing } from '../../utils/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해 주세요.');
      return;
    }
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch {
      setError('이메일 또는 비밀번호가 일치하지 않아요.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>← 뒤로</Text>
          </TouchableOpacity>

          <Text style={styles.title}>로그인하기</Text>
          <Text style={styles.subtitle}>수강 정보를 확인하려면 로그인해 주세요.</Text>

          <View style={styles.form}>
            <Input
              label="이메일"
              value={email}
              onChangeText={setEmail}
              placeholder="student@university.ac.kr"
              keyboardType="email-address"
              leftIcon="mail-outline"
            />
            <Input
              label="비밀번호"
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              label="로그인하기"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.submitBtn}
              size="lg"
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>아직 계정이 없으신가요?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>회원가입하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: Spacing.xl },
  back: { marginBottom: Spacing.xl },
  backText: { fontSize: 15, color: Colors.primary },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: Spacing.xl },
  form: { gap: 4 },
  error: { fontSize: 13, color: Colors.error, marginBottom: Spacing.sm },
  submitBtn: { marginTop: Spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: Spacing.xl },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
});
