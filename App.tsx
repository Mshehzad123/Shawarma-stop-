import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Sonner } from './components/ui/sonner';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';

// Mobile Screens
import LocationPermissionScreen from './components/screens/LocationPermissionScreen';
import OnboardingOne from './components/screens/OnboardingOne';
import OnboardingTwo from './components/screens/OnboardingTwo';
import OTPScreen from './components/screens/OTPScreen';
import RegistrationScreen from './components/screens/RegistrationScreen';
import SplashScreen from './components/screens/SplashScreen';
import WelcomeScreen from './components/screens/WelcomeScreen';

const queryClient = new QueryClient();

type Screen = 
  | 'splash'
  | 'onboarding1' 
  | 'onboarding2'
  | 'welcome'
  | 'register'
  | 'otp'
  | 'otp-error'
  | 'location-permission'
  | 'home';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userEmail, setUserEmail] = useState('sample@example.com');

  useEffect(() => {
    // Auto-advance from splash screen
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding1');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      
      case 'onboarding1':
        return (
          <OnboardingOne onNext={() => setCurrentScreen('onboarding2')} />
        );
      
      case 'onboarding2':
        return (
          <OnboardingTwo onNext={() => setCurrentScreen('welcome')} />
        );
      
      case 'welcome':
        return (
          <WelcomeScreen
            onSignIn={() => setCurrentScreen('welcome')} // You can implement sign in flow
            onCreateAccount={() => setCurrentScreen('register')}
          />
        );
      
      case 'register':
        return (
          <RegistrationScreen
            onBack={() => setCurrentScreen('welcome')}
            onSignUp={(data) => {
              setUserEmail(data.email);
              setCurrentScreen('otp');
            }}
          />
        );
      
      case 'otp':
        return (
          <OTPScreen
            onBack={() => setCurrentScreen('register')}
            onVerify={(code) => {
              // Simulate wrong code for demo
              if (code === '1234') {
                setCurrentScreen('location-permission');
              } else {
                setCurrentScreen('otp-error');
              }
            }}
            email={userEmail}
          />
        );
      
      case 'otp-error':
        return (
          <OTPScreen
            onBack={() => setCurrentScreen('register')}
            onVerify={(code) => {
              if (code === '7828') {
                setCurrentScreen('location-permission');
              }
            }}
            email={userEmail}
            hasError={true}
          />
        );
      
      case 'location-permission':
        return (
          <LocationPermissionScreen
            onContinue={() => setCurrentScreen('home')}
          />
        );
      
      case 'home':
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F95233' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: 'white', textAlign: 'center' }}>
                Welcome to Shawarma Stop! 🌯
              </Text>
              <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 32 }}>
                Your delicious journey begins here!
              </Text>
              <TouchableOpacity 
                onPress={() => setCurrentScreen('splash')}
                style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: 'white', borderRadius: 12 }}
              >
                <Text style={{ color: '#F95233', fontSize: 16, fontWeight: '500' }}>
                  Restart Demo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      
      default:
        return <SplashScreen />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        {renderScreen()}
        <Toaster toasts={[]} onRemove={() => {}} />
        <Sonner toasts={[]} onRemove={() => {}} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;


