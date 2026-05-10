import React, { useRef, useEffect } from "react";
import {
    Animated,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";

import { COLORS } from "../other/colors";

// expo-navigation-bar is Android-only — skip on web/iOS
const setNavBarHidden = async () => {
    if (Platform.OS === "android") {
        const NavBar = await import("expo-navigation-bar");
        NavBar.setVisibilityAsync("hidden");
    }
};

// ─── Web-only hover style injection ──────────────────────────────────────────
// Injects a <style> tag once so CSS :hover transitions work on web.
// On native this block is never reached.
if (Platform.OS === "web" && typeof document !== "undefined") {
    const styleId = "bottom-bar-hover-styles";
    if (!document.getElementById(styleId)) {
        const el = document.createElement("style");
        el.id = styleId;
        el.textContent = `
      .tab-btn {
        transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
                    opacity 0.18s ease;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
      .tab-btn:hover {
        transform: translateY(-3px) scale(1.08);
        opacity: 0.85;
      }
      .tab-btn:active {
        transform: scale(0.88);
        opacity: 0.7;
        transition: transform 0.08s ease, opacity 0.08s ease;
      }
    `;
        document.head.appendChild(el);
    }
}

// ─── Individual tab button ────────────────────────────────────────────────────
type TabButtonProps = {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    isActive: boolean;
    onPress: () => void;
};

const TabButton = ({ icon, label, isActive, onPress }: TabButtonProps) => {
    // Press scale (native) — on web CSS handles it
    const scale = useRef(new Animated.Value(1)).current;
    // Float bounce when tab becomes active
    const floatY = useRef(new Animated.Value(0)).current;
    // Active glow/underline opacity
    const activeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

    useEffect(() => {
        Animated.spring(activeAnim, {
            toValue: isActive ? 1 : 0,
            useNativeDriver: true,
            tension: 60,
            friction: 8,
        }).start();

        if (isActive) {
            Animated.sequence([
                Animated.timing(floatY, {
                    toValue: -5,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.spring(floatY, {
                    toValue: 0,
                    tension: 130,
                    friction: 6,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isActive]);

    // Native-only press handlers (web uses CSS :active)
    const handlePressIn = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, {
            toValue: 0.82,
            useNativeDriver: true,
            tension: 200,
            friction: 10,
        }).start();
    };

    const handlePressOut = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 80,
            friction: 5,
        }).start();
    };

    const innerContent = (
        <Animated.View
            style={[
                styles.tabInner,
                { transform: [{ scale }, { translateY: floatY }] },
            ]}
        >
            {/* Active glow dot */}
            <Animated.View style={[styles.glowDot, { opacity: activeAnim }]} />

            <Ionicons
                name={isActive ? icon : (`${icon}-outline` as any)}
                size={26}
                color={isActive ? COLORS.MainText : `${COLORS.MainText}77`}
                style={styles.icon}
            />

            <Animated.Text
                style={[
                    styles.label,
                    {
                        opacity: activeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.45, 1],
                        }),
                        fontWeight: isActive ? "700" : "400",
                    },
                ]}
            >
                {label}
            </Animated.Text>

            {/* Active underline bar */}
            <Animated.View
                style={[
                    styles.activeBar,
                    {
                        transform: [
                            {
                                scaleX: activeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                }),
                            },
                        ],
                        opacity: activeAnim,
                    },
                ]}
            />
        </Animated.View>
    );

    // On web: plain <div> with CSS class for :hover / :active.
    // On native: Pressable with RN Animated handlers.
    if (Platform.OS === "web") {
        return (
            <div
                className="tab-btn"
                onClick={onPress}
                role="button"
                aria-label={label}
                style={{ flex: 1, display: "flex", justifyContent: "center" }}
            >
                {innerContent}
            </div>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.tabPressable}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            {innerContent}
        </Pressable>
    );
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
    { icon: "home" as const, label: "Accueil", route: "/" },
    { icon: "folder" as const, label: "Podcasts", route: "/(tabs)/podcasts" },
    { icon: "people" as const, label: "Héros", route: "/(tabs)/heros" },
];

// ─── Bottom bar ───────────────────────────────────────────────────────────────
// IMPORTANT: place <BottomBar /> in your root layout file (e.g. app/_layout.tsx),
// outside of any <Stack> or <Tabs> navigator. That way it is never unmounted
// during tab navigation, so the entrance animation only ever plays once.
//
// Example _layout.tsx:
//   export default function RootLayout() {
//     return (
//       <SafeAreaProvider>
//         <Stack screenOptions={{ headerShown: false }} />
//         <BottomBar />          ← here, after the navigator
//       </SafeAreaProvider>
//     );
//   }
const BottomBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const slideY = useRef(new Animated.Value(80)).current;
    const barOpacity = useRef(new Animated.Value(0)).current;
    // Guard so the entrance animation only fires on the very first mount
    const hasAnimated = useRef(false);

    useEffect(() => {
        setNavBarHidden();

        if (!hasAnimated.current) {
            hasAnimated.current = true;
            Animated.parallel([
                Animated.spring(slideY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 9,
                    delay: 150,
                }),
                Animated.timing(barOpacity, {
                    toValue: 1,
                    duration: 300,
                    delay: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, []);

    const isActive = (route: string) => {
        if (route === "/") return pathname === "/" || pathname === "";
        return pathname.startsWith(route.replace("/(tabs)", ""));
    };

    return (
        <Animated.View
            style={[
                styles.barView,
                { transform: [{ translateY: slideY }], opacity: barOpacity },
            ]}
        >
            <View style={styles.topBorder} />

            <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
                {TABS.map((tab) => (
                    <TabButton
                        key={tab.route}
                        icon={tab.icon}
                        label={tab.label}
                        isActive={isActive(tab.route)}
                        onPress={() => router.push(tab.route as any)}
                    />
                ))}
            </View>
        </Animated.View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    barView: {
        backgroundColor: COLORS.SecondBack,
        position: "absolute",
        bottom: 0,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 20,
    },
    topBorder: {
        height: 1.5,
        backgroundColor: COLORS.MainText,
        opacity: 0.25,
    },
    bar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
        paddingTop: 8,
    },
    tabPressable: {
        flex: 1,
        alignItems: "center",
    },
    tabInner: {
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 12,
        position: "relative",
    },
    glowDot: {
        position: "absolute",
        top: -2,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.MainText,
        shadowColor: COLORS.MainText,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
    },
    icon: {
        marginBottom: 3,
    },
    label: {
        color: COLORS.MainText,
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    activeBar: {
        marginTop: 4,
        height: 2,
        width: 24,
        borderRadius: 1,
        backgroundColor: COLORS.MainText,
    },
});

export default BottomBar;