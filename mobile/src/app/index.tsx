import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Session } from '@supabase/supabase-js';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type Role = 'commuter' | 'driver';
type Screen = 'home' | 'search' | 'requests' | 'wallet' | 'profile';

type RideOffer = {
  id: string;
  driver: string;
  pickup: string;
  destination: string;
  departure: string;
  fare: string;
  seats: number;
};

const demoOffers: RideOffer[] = [
  {
    id: 'offer-1',
    driver: 'Ari Santos',
    pickup: 'UP Town Center',
    destination: 'Katipunan Campus',
    departure: 'Today, 4:30 PM',
    fare: 'PHP 45',
    seats: 2,
  },
  {
    id: 'offer-2',
    driver: 'Mika Reyes',
    pickup: 'Cubao MRT',
    destination: 'Ateneo Gate 3',
    departure: 'Tomorrow, 7:15 AM',
    fare: 'PHP 60',
    seats: 3,
  },
];

function Brand() {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandMark}>
        <Text style={styles.brandMarkText}>PB</Text>
      </View>
      <View>
        <Text style={styles.brandName}><Text style={styles.brandRed}>Pasa</Text>Bai</Text>
        <Text style={styles.brandTagline}>Student commute network</Text>
      </View>
    </View>
  );
}

function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.primaryButton, disabled && styles.disabledButton]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function Field({ label, value, onChangeText, secure = false, placeholder }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secure?: boolean;
  placeholder?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7B879C"
        secureTextEntry={secure}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

function AuthScreen({ onReady }: { onReady: (role: Role) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!supabase) {
      Alert.alert('Demo mode', 'Add the values in mobile/.env to connect Supabase authentication.');
      return;
    }
    if (!email.trim() || password.length < 6) {
      Alert.alert('Check your details', 'Enter an email address and a password with at least 6 characters.');
      return;
    }
    setBusy(true);
    const result = isRegistering
      ? await supabase.auth.signUp({ email: email.trim(), password })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (result.error) {
      Alert.alert('Unable to continue', result.error.message);
      return;
    }
    if (isRegistering) {
      Alert.alert('Check your email', 'Confirm your account, then sign in to continue.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.authContent} keyboardShouldPersistTaps="handled">
        <Brand />
        <View style={styles.heroCopy}>
          <Text style={styles.title}>Your safer school commute starts here.</Text>
          <Text style={styles.subtitle}>Find a shared ride or manage your student-driver trips from one place.</Text>
        </View>
        <View style={styles.authCard}>
          <Text style={styles.cardTitle}>{isRegistering ? 'Create your account' : 'Welcome back'}</Text>
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@school.edu" />
          <Field label="Password" value={password} onChangeText={setPassword} secure placeholder="At least 6 characters" />
          <PrimaryButton label={busy ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'} onPress={submit} disabled={busy} />
          <Pressable onPress={() => setIsRegistering((value) => !value)} style={styles.textButton}>
            <Text style={styles.textButtonLabel}>{isRegistering ? 'Already have an account? Sign in' : 'New to PasaBai? Create an account'}</Text>
          </Pressable>
        </View>
        {!isSupabaseConfigured && (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Preview mode</Text>
            <Text style={styles.noticeText}>Explore the commuter or driver flow without a backend connection.</Text>
            <View style={styles.roleButtons}>
              <SecondaryButton label="Try commuter" onPress={() => onReady('commuter')} />
              <SecondaryButton label="Try driver" onPress={() => onReady('driver')} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function RideCard({ offer, onRequest }: { offer: RideOffer; onRequest: () => void }) {
  return (
    <View style={styles.rideCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{offer.driver.slice(0, 1)}</Text></View>
        <View style={styles.flex}><Text style={styles.cardTitle}>{offer.driver}</Text><Text style={styles.muted}>{offer.departure}</Text></View>
        <Text style={styles.fare}>{offer.fare}</Text>
      </View>
      <View style={styles.routeLine}><Text style={styles.routeDot}>A</Text><Text style={styles.routeText}>{offer.pickup}</Text></View>
      <View style={styles.routeLine}><Text style={[styles.routeDot, styles.routeDestination]}>B</Text><Text style={styles.routeText}>{offer.destination}</Text></View>
      <View style={styles.cardFooter}>
        <Text style={styles.muted}>{offer.seats} seats left</Text>
        <Pressable onPress={onRequest} style={styles.smallAction}><Text style={styles.smallActionText}>Request seat</Text></Pressable>
      </View>
    </View>
  );
}

function SearchScreen() {
  const [query, setQuery] = useState('');
  const shownOffers = demoOffers.filter((offer) => `${offer.pickup} ${offer.destination} ${offer.driver}`.toLowerCase().includes(query.toLowerCase()));
  const request = (offer: RideOffer) => Alert.alert('Seat request created', `Your request for ${offer.driver}'s ${offer.departure} ride is pending driver approval.`);
  return (
    <>
      <Text style={styles.sectionTitle}>Find a ride</Text>
      <Text style={styles.sectionCopy}>Search by pickup, destination, or driver.</Text>
      <TextInput value={query} onChangeText={setQuery} placeholder="Where are you going?" placeholderTextColor="#7B879C" style={styles.searchInput} />
      {shownOffers.map((offer) => <RideCard key={offer.id} offer={offer} onRequest={() => request(offer)} />)}
      {!shownOffers.length && <Text style={styles.emptyText}>No matching rides yet. Try a different pickup or destination.</Text>}
    </>
  );
}

function DriverHome() {
  return (
    <>
      <Text style={styles.sectionTitle}>Your driver day</Text>
      <Text style={styles.sectionCopy}>Publish your next trip and keep each request organized.</Text>
      <View style={styles.statRow}>
        <View style={styles.stat}><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>Active rides</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>PHP 0</Text><Text style={styles.statLabel}>Collected today</Text></View>
      </View>
      <View style={styles.rideCard}>
        <Text style={styles.cardTitle}>Ready to publish a ride?</Text>
        <Text style={[styles.muted, styles.cardBody]}>Your driver and vehicle verification must be approved before riders can find your trip.</Text>
        <PrimaryButton label="Create ride offer" onPress={() => Alert.alert('Ride offer', 'This screen will save to the ride_offers table after Supabase is configured.')} />
      </View>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Verification needed</Text>
        <Text style={styles.noticeText}>Add your student, license, and vehicle documents in Profile before publishing.</Text>
      </View>
    </>
  );
}

function RequestsScreen({ role }: { role: Role }) {
  return (
    <>
      <Text style={styles.sectionTitle}>{role === 'driver' ? 'Ride requests' : 'My requests'}</Text>
      <Text style={styles.sectionCopy}>{role === 'driver' ? 'Accepting a request reserves seats in one database transaction.' : 'Accepted rides will appear here with pickup instructions.'}</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Nothing waiting right now</Text>
        <Text style={styles.emptyText}>{role === 'driver' ? 'New commuter requests will arrive here.' : 'Search rides to send your first request.'}</Text>
      </View>
    </>
  );
}

function WalletScreen() {
  const [isPaid, setIsPaid] = useState(false);
  return (
    <>
      <Text style={styles.sectionTitle}>Wallet</Text>
      <Text style={styles.sectionCopy}>Track collected fares and balances due later.</Text>
      <View style={styles.statRow}>
        <View style={styles.stat}><Text style={styles.statValue}>PHP {isPaid ? '45' : '0'}</Text><Text style={styles.statLabel}>Paid</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>PHP {isPaid ? '0' : '45'}</Text><Text style={styles.statLabel}>Unpaid</Text></View>
      </View>
      <View style={styles.rideCard}>
        <Text style={styles.cardTitle}>Sample pay-later balance</Text>
        <Text style={[styles.muted, styles.cardBody]}>Campus to Katipunan Campus · PHP 45</Text>
        <SecondaryButton label={isPaid ? 'Marked paid' : 'Mark as paid'} onPress={() => setIsPaid(true)} />
      </View>
      <Text style={styles.legalNote}>External payments must be verified by a payment provider on the server. This control is for driver-recorded cash or pay-later balances.</Text>
    </>
  );
}

function ProfileScreen({ role, onSignOut }: { role: Role; onSignOut: () => void }) {
  return (
    <>
      <Text style={styles.sectionTitle}>Profile and safety</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>P</Text></View>
        <View><Text style={styles.cardTitle}>PasaBai member</Text><Text style={styles.muted}>{role === 'driver' ? 'Student driver' : 'Student commuter'}</Text></View>
      </View>
      <View style={styles.settingRow}><Text style={styles.settingTitle}>Account details</Text><Text style={styles.settingValue}>Edit</Text></View>
      <View style={styles.settingRow}><Text style={styles.settingTitle}>Student verification</Text><Text style={styles.settingValue}>Start</Text></View>
      {role === 'driver' && <View style={styles.settingRow}><Text style={styles.settingTitle}>Driver and vehicle review</Text><Text style={styles.settingValue}>Start</Text></View>}
      <View style={styles.settingRow}><Text style={styles.settingTitle}>Emergency contact</Text><Text style={styles.settingValue}>Add</Text></View>
      <View style={styles.settingRow}><Text style={styles.settingTitle}>Privacy and location sharing</Text><Text style={styles.settingValue}>Review</Text></View>
      <SecondaryButton label="Sign out" onPress={onSignOut} />
    </>
  );
}

function AppShell({ session, initialRole, onSignOut }: { session: Session | null; initialRole: Role; onSignOut: () => void }) {
  const [role, setRole] = useState<Role>(initialRole);
  const [screen, setScreen] = useState<Screen>('home');
  const renderScreen = () => {
    if (screen === 'search') return <SearchScreen />;
    if (screen === 'requests') return <RequestsScreen role={role} />;
    if (screen === 'wallet') return <WalletScreen />;
    if (screen === 'profile') return <ProfileScreen role={role} onSignOut={onSignOut} />;
    return role === 'driver' ? <DriverHome /> : <SearchScreen />;
  };
  const tabs: { key: Screen; label: string }[] = role === 'driver'
    ? [{ key: 'home', label: 'Home' }, { key: 'requests', label: 'Requests' }, { key: 'wallet', label: 'Wallet' }, { key: 'profile', label: 'Profile' }]
    : [{ key: 'home', label: 'Home' }, { key: 'search', label: 'Search' }, { key: 'requests', label: 'Rides' }, { key: 'profile', label: 'Profile' }];
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appHeader}>
        <Brand />
        <Pressable onPress={() => setRole((value) => value === 'driver' ? 'commuter' : 'driver')} style={styles.rolePill}>
          <Text style={styles.rolePillText}>{role === 'driver' ? 'Driver' : 'Commuter'}</Text>
        </Pressable>
      </View>
      {!session && <View style={styles.demoBanner}><Text style={styles.demoBannerText}>Demo mode: add mobile/.env to connect Supabase.</Text></View>}
      <ScrollView contentContainerStyle={styles.screenContent}>{renderScreen()}</ScrollView>
      <View style={styles.tabBar}>
        {tabs.map((tab) => <Pressable key={tab.key} onPress={() => setScreen(tab.key)} style={[styles.tab, screen === tab.key && styles.activeTab]}><Text style={[styles.tabText, screen === tab.key && styles.activeTabText]}>{tab.label}</Text></Pressable>)}
      </View>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [demoRole, setDemoRole] = useState<Role | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (supabase && session) await supabase.auth.signOut();
    setSession(null);
    setDemoRole(null);
  };

  if (!session && !demoRole) return <AuthScreen onReady={setDemoRole} />;
  return <AppShell session={session} initialRole={demoRole ?? 'commuter'} onSignOut={signOut} />;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  authContent: { padding: 24, gap: 28, flexGrow: 1, justifyContent: 'center' },
  screenContent: { padding: 20, paddingBottom: 24, gap: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#102A56', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  brandName: { fontSize: 24, fontWeight: '800', color: '#102A56' },
  brandRed: { color: '#E5252A' },
  brandTagline: { color: '#68758A', fontSize: 13, marginTop: 1 },
  heroCopy: { gap: 10 },
  title: { color: '#102A56', fontSize: 32, lineHeight: 39, fontWeight: '800' },
  subtitle: { color: '#58667E', fontSize: 17, lineHeight: 25 },
  authCard: { borderWidth: 1, borderColor: '#E6EAF0', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, gap: 14, shadowColor: '#102A56', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  cardTitle: { color: '#102A56', fontSize: 17, fontWeight: '700' },
  field: { gap: 6 },
  fieldLabel: { color: '#36445C', fontSize: 13, fontWeight: '600' },
  input: { height: 48, borderRadius: 10, backgroundColor: '#F6F8FB', borderWidth: 1, borderColor: '#E2E7EF', color: '#102A56', paddingHorizontal: 13, fontSize: 16 },
  primaryButton: { height: 48, borderRadius: 12, backgroundColor: '#102A56', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  disabledButton: { opacity: 0.55 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryButton: { minHeight: 42, borderRadius: 11, borderWidth: 1, borderColor: '#CCD4E0', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  secondaryButtonText: { color: '#102A56', fontSize: 14, fontWeight: '700' },
  textButton: { alignItems: 'center', paddingTop: 4 },
  textButtonLabel: { color: '#1A5CAD', fontSize: 14, fontWeight: '600' },
  notice: { backgroundColor: '#F2F6FC', borderRadius: 14, padding: 16, gap: 8 },
  noticeTitle: { color: '#102A56', fontSize: 16, fontWeight: '700' },
  noticeText: { color: '#58667E', fontSize: 14, lineHeight: 20 },
  roleButtons: { flexDirection: 'row', gap: 10, marginTop: 4 },
  flex: { flex: 1 },
  appHeader: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEF1F5' },
  rolePill: { backgroundColor: '#F0F4FA', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20 },
  rolePillText: { color: '#102A56', fontSize: 12, fontWeight: '700' },
  demoBanner: { backgroundColor: '#FFF4DB', paddingVertical: 8, paddingHorizontal: 20 },
  demoBannerText: { color: '#7B4B00', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  sectionTitle: { color: '#102A56', fontSize: 27, fontWeight: '800', marginTop: 4 },
  sectionCopy: { color: '#58667E', fontSize: 15, lineHeight: 22, marginBottom: 4 },
  searchInput: { height: 48, borderWidth: 1, borderColor: '#E2E7EF', borderRadius: 12, paddingHorizontal: 14, backgroundColor: '#F6F8FB', color: '#102A56', fontSize: 16 },
  rideCard: { borderWidth: 1, borderColor: '#E6EAF0', borderRadius: 15, padding: 16, gap: 12, backgroundColor: '#FFFFFF' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E8F0FE', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#1A5CAD', fontSize: 15, fontWeight: '800' },
  muted: { color: '#68758A', fontSize: 13 },
  fare: { color: '#102A56', fontSize: 15, fontWeight: '800' },
  routeLine: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  routeDot: { width: 23, height: 23, borderRadius: 12, backgroundColor: '#E8F0FE', color: '#1A5CAD', fontSize: 12, fontWeight: '800', textAlign: 'center', lineHeight: 23 },
  routeDestination: { backgroundColor: '#FFE8E9', color: '#C51F25' },
  routeText: { color: '#36445C', fontSize: 14, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallAction: { backgroundColor: '#102A56', borderRadius: 9, paddingVertical: 8, paddingHorizontal: 11 },
  smallActionText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 52, paddingHorizontal: 20, backgroundColor: '#F7F9FC', borderRadius: 16, gap: 8 },
  emptyTitle: { color: '#102A56', fontSize: 17, fontWeight: '700' },
  emptyText: { color: '#68758A', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  statRow: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#F2F6FC', gap: 4 },
  statValue: { color: '#102A56', fontSize: 22, fontWeight: '800' },
  statLabel: { color: '#68758A', fontSize: 12, fontWeight: '600' },
  cardBody: { lineHeight: 20 },
  legalNote: { color: '#68758A', fontSize: 12, lineHeight: 18, paddingHorizontal: 2 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16, borderWidth: 1, borderColor: '#E6EAF0', borderRadius: 15 },
  profileAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#102A56', alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 18 },
  settingRow: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEF1F5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTitle: { color: '#36445C', fontSize: 15, fontWeight: '600' },
  settingValue: { color: '#1A5CAD', fontSize: 14, fontWeight: '700' },
  tabBar: { flexDirection: 'row', paddingHorizontal: 10, paddingTop: 8, paddingBottom: 12, borderTopWidth: 1, borderTopColor: '#E6EAF0', backgroundColor: '#FFFFFF' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 42, borderRadius: 10 },
  activeTab: { backgroundColor: '#102A56' },
  tabText: { color: '#68758A', fontSize: 12, fontWeight: '700' },
  activeTabText: { color: '#FFFFFF' },
});
