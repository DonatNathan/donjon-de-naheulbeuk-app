import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

import { COLORS } from "../../other/colors";
import Sentences from "../../assets/files/sentences.json";

// Web icons (react-icons)
import {
    IoArrowForward,
} from "react-icons/io5";

// ─── Web hover styles ─────────────────────────────────────────────────────────
if (Platform.OS === "web" && typeof document !== "undefined") {
    const id = "home-hover-styles";
    if (!document.getElementById(id)) {
        const el = document.createElement("style");
        el.id = id;
        el.textContent = `
      .enter-btn {
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                    opacity 0.2s ease,
                    box-shadow 0.2s ease;
        text-decoration: none;
      }
      .enter-btn:hover {
        transform: scale(1.04) translateY(-3px);
        opacity: 0.92;
      }
      .enter-btn:active {
        transform: scale(0.96);
        opacity: 0.75;
        transition: transform 0.08s ease, opacity 0.08s ease;
      }
    `;
        document.head.appendChild(el);
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const BASE = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const img = (path: string) => `${BASE}images/${path}`;

// ─── Fade hook ────────────────────────────────────────────────────────────────
const useFadeIn = (delay: number) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                delay,
                tension: 55,
                friction: 9,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return { opacity, transform: [{ translateY }] };
};

// ─── Icon renderer (cross-platform) ──────────────────────────────────────────
const renderIcon = (size = 18, color = "white") => {
    if (Platform.OS === "web") {
        return <IoArrowForward size={size} color={color} />;
    }

    return <Ionicons name="arrow-forward" size={size} color={color} />;
};

// ─── Divider ─────────────────────────────────────────────────────────────────
const Divider = () => (
    <View style={div.row}>
        <View style={div.line} />
        <Text style={div.gem}>✦</Text>
        <View style={div.line} />
    </View>
);

const div = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        paddingHorizontal: 32,
    },
    line: { flex: 1, height: 1, backgroundColor: COLORS.MainText, opacity: 0.18 },
    gem: { color: COLORS.MainText, opacity: 0.4, marginHorizontal: 12, fontSize: 12 },
});

// ─── Random content ──────────────────────────────────────────────────────────
const RandomContent = ({ width }: { width: number }) => {
    const [entry] = useState(
        () => Sentences[Math.floor(Math.random() * Sentences.length)]
    );

    const anim = useFadeIn(350);
    const imgSize = Math.min(width * 0.38, 180);

    const floatY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(floatY, {
                    toValue: -8,
                    duration: 2200,
                    useNativeDriver: true,
                }),
                Animated.timing(floatY, {
                    toValue: 0,
                    duration: 2200,
                    useNativeDriver: true,
                }),
            ])
        );

        const timer = setTimeout(() => loop.start(), 800);
        return () => {
            clearTimeout(timer);
            loop.stop();
        };
    }, []);

    return (
        <Animated.View style={[styles.quoteBlock, anim]}>
            <Text style={styles.quoteMark}>"</Text>
            <Text style={styles.quoteText}>{entry.content}</Text>
            <Text style={[styles.quoteMark, styles.quoteMarkClose]}>"</Text>

            <Animated.Image
                source={{ uri: img(entry.image) }}
                style={[
                    styles.randomImage,
                    {
                        width: imgSize,
                        height: imgSize,
                        borderRadius: imgSize / 2,
                    },
                    { transform: [{ translateY: floatY }] },
                ]}
                resizeMode="cover"
            />
        </Animated.View>
    );
};

// ─── Enter button ────────────────────────────────────────────────────────────
const EnterButton = () => {
    const router = useRouter();
    const anim = useFadeIn(520);
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 200,
            friction: 10,
        }).start();
    };

    const pressOut = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 80,
            friction: 5,
        }).start();
    };

    const inner = (
        <Animated.View
            style={[
                styles.button,
                anim,
                { transform: [...(anim.transform as any), { scale }] },
            ]}
        >
            <Text style={styles.buttonText}>Entrer dans le Donjon</Text>

            <View style={styles.arrowCircle}>
                {renderIcon(18, COLORS.MainBack)}
            </View>
        </Animated.View>
    );

    if (Platform.OS === "web") {
        return (
            <div
                className="enter-btn"
                onClick={() => router.push("/podcasts" as any)}
                style={{ display: "flex", justifyContent: "center" }}
            >
                {inner}
            </div>
        );
    }

    return (
        <Pressable
            onPress={() => router.push("/podcasts" as any)}
            onPressIn={pressIn}
            onPressOut={pressOut}
        >
            {inner}
        </Pressable>
    );
};

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const { width, height } = useWindowDimensions();
    const logoAnim = useFadeIn(0);

    const logoHeight = Math.min(height * 0.18, 140);
    const logoWidth = Math.min(width * 0.78, 380);

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
                styles.content,
                { paddingBottom: 120, minHeight: height },
            ]}
            showsVerticalScrollIndicator={false}
        >
            <Animated.Image
                source={{ uri: img("logo.png") }}
                style={[
                    styles.logo,
                    logoAnim,
                    { width: logoWidth, height: logoHeight },
                ]}
                resizeMode="contain"
            />

            <Animated.Text style={[styles.eyebrow, useFadeIn(120)]}>
                Le podcast de l'aventure
            </Animated.Text>

            <Divider />

            <RandomContent width={width} />

            <Divider />

            <EnterButton />
        </ScrollView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: COLORS.MainBack,
    },
    content: {
        paddingTop: 60,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        alignSelf: "center",
        marginBottom: 10,
    },
    eyebrow: {
        color: COLORS.MainText,
        opacity: 0.4,
        fontSize: 11,
        letterSpacing: 3,
        textTransform: "uppercase",
        textAlign: "center",
    },

    quoteBlock: {
        alignItems: "center",
        paddingHorizontal: 16,
        width: "100%",
    },
    quoteMark: {
        fontSize: 52,
        color: COLORS.MainText,
        opacity: 0.15,
        lineHeight: 44,
        alignSelf: "flex-start",
        marginLeft: 16,
    },
    quoteMarkClose: {
        alignSelf: "flex-end",
        marginRight: 16,
        marginTop: -8,
    },
    quoteText: {
        textAlign: "center",
        fontStyle: "italic",
        color: COLORS.MainText,
        fontSize: 15,
        lineHeight: 24,
        opacity: 0.85,
        paddingHorizontal: 8,
    },
    randomImage: {
        marginTop: 24,
        borderWidth: 1.5,
        borderColor: COLORS.MainText,
        opacity: 0.9,
        shadowColor: COLORS.MainText,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
        elevation: 6,
    },

    button: {
        backgroundColor: COLORS.SecondBack,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingLeft: 28,
        paddingRight: 16,
        borderRadius: 50,
        alignSelf: "center",
        width: "80%",
        maxWidth: 340,
        borderWidth: 1,
        borderColor: COLORS.MainText,
        shadowColor: COLORS.MainText,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    buttonText: {
        color: COLORS.MainText,
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    arrowCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: COLORS.MainText,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 12,
    },
});