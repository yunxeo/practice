import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Colors, Spacing } from '../../utils/colors';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <Text style={styles.logoIcon}>🎓</Text>
          <Text style={styles.appName}>Profiler AI</Text>
          <Text style={styles.tagline}>
            교수를 알면 수강이 쉬워져요
          </Text>
          <Text style={styles.taglineSub}>
            수강생들의 경험을 바탕으로 교수의 강의 스타일과{'\n'}평가 방식을 한눈에 확인해 보세요.
          </Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: '🔍', text: '교수명·과목명으로 빠르게 검색' },
            { icon: '⭐', text: '수강생들의 생생한 후기' },
            { icon: '🤖', text: 'AI가 핵심만 정리해 드려요' },
          ].map(({ icon, text }) => (
            <View key={text} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{icon}</Text>
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="시작하기"
          onPress={() => router.push('/(auth)/register')}
          style={styles.primaryBtn}
        />
        <Button
          label="로그인하기"
          onPress={() => router.push('/(auth)/login')}
          variant="ghost"
          style={styles.ghostBtn}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl, paddingTop: height * 0.1 },
  logoSection: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoIcon: { fontSize: 64, marginBottom: Spacing.md },
  appName: { fontSize: 36, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  tagline: { fontSize: 22, color: '#fff', textAlign: 'center', marginTop: Spacing.sm, lineHeight: 30, fontWeight: '700' },
  taglineSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: Spacing.sm, lineHeight: 22 },
  features: { gap: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: Spacing.md },
  featureIcon: { fontSize: 24 },
  featureText: { fontSize: 15, color: '#fff', fontWeight: '500' },
  actions: { padding: Spacing.xl, paddingBottom: Spacing.xxl, gap: Spacing.sm },
  primaryBtn: { backgroundColor: '#fff' },
  ghostBtn: {},
});
