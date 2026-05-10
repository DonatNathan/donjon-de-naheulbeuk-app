import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { COLORS } from "../../other/colors";

// ─── Web hover styles ─────────────────────────────────────────────────────────
if (Platform.OS === "web" && typeof document !== "undefined") {
    const id = "heroes-hover-styles";
    if (!document.getElementById(id)) {
        const el = document.createElement("style");
        el.id = id;
        el.textContent = `
      .hero-card {
        transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                    box-shadow 0.22s ease;
        cursor: pointer;
      }
      .hero-card:hover {
        transform: translateY(-6px) scale(1.07);
      }
      .master-link {
        cursor: pointer;
        transition: opacity 0.15s ease;
      }
      .master-link:hover { opacity: 0.7; }
    `;
        document.head.appendChild(el);
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const BASE = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const img = (path: string) => `${BASE}images/${path}.png`;

// Staggered fade+slide in
const useFadeIn = (delay: number) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(24)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 420,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                delay,
                tension: 60,
                friction: 9,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);
    return { opacity, transform: [{ translateY }] };
};

// ─── Ornamental divider ───────────────────────────────────────────────────────
const Divider = () => (
    <View style={div.row}>
        <View style={div.line} />
        <Text style={div.gem}>✦</Text>
        <View style={div.line} />
    </View>
);
const div = StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", marginVertical: 18, paddingHorizontal: 24 },
    line: { flex: 1, height: 1, backgroundColor: COLORS.MainText, opacity: 0.2 },
    gem: { color: COLORS.MainText, opacity: 0.45, marginHorizontal: 10, fontSize: 12 },
});

// ─── Hero card ────────────────────────────────────────────────────────────────
type HeroProps = { path: string; name: string; delay: number; cardSize: number };

const HeroCard: React.FC<HeroProps> = ({ path, name, delay, cardSize }) => {
    const anim = useFadeIn(delay);
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, tension: 200, friction: 10 }).start();
    };
    const pressOut = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 5 }).start();
    };

    const imageSize = cardSize * 0.62;

    const inner = (
        <Animated.View style={[styles.heroContainer, anim, { transform: [...(anim.transform as any), { scale }], width: cardSize }]}>
            {/* Hexagonal-ish frame */}
            <View style={[styles.heroFrame, { width: imageSize + 8, height: imageSize + 8, borderRadius: imageSize / 2 + 4 }]}>
                <Image
                    source={{ uri: img(path) }}
                    style={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }}
                    resizeMode="cover"
                />
            </View>
            <Text style={styles.heroName}>{name}</Text>
            {/* Small decorative dot */}
            <View style={styles.heroDot} />
        </Animated.View>
    );

    if (Platform.OS === "web") {
        return (
            <div className="hero-card" style={{ display: "flex" }}>
                {inner}
            </div>
        );
    }
    return (
        <Pressable onPressIn={pressIn} onPressOut={pressOut}>
            {inner}
        </Pressable>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const Heroes = () => {
    const { width } = useWindowDimensions();

    // Responsive sizing
    const isNarrow = width < 400;
    const isMedium = width < 700;
    const masterSize = isNarrow ? 110 : isMedium ? 140 : 170;
    // How many hero columns: 3 on narrow, up to 6 on wide
    const cols = isNarrow ? 3 : isMedium ? 4 : 6;
    const cardSize = Math.floor((width - 48) / cols); // 48px total padding

    const headerAnim = useFadeIn(0);
    const masterAnim = useFadeIn(120);

    const HEROES: { path: string; name: string }[] = [
        { path: "main",       name: "Aventurier" },
        { path: "nain",       name: "Nain"       },
        { path: "elfe",       name: "Elfe"       },
        { path: "barbare",    name: "Barbare"    },
        { path: "magicienne", name: "Magicienne" },
        { path: "ogre",       name: "Ogre"       },
    ];

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Header ── */}
            <Animated.View style={[styles.headerBlock, headerAnim]}>
                <Text style={styles.eyebrow}>Le Donjon de Naheulbeuk</Text>
                <Text style={styles.headerText}>Héros</Text>
            </Animated.View>

            <Divider />

            {/* ── Dungeon Master ── */}
            <Animated.View style={[styles.masterBlock, masterAnim]}>
                <View style={[styles.masterFrame, { width: masterSize + 10, height: masterSize + 10, borderRadius: masterSize / 2 + 5 }]}>
                    <Image
                        source={{ uri: img("penofchaos") }}
                        style={{ width: masterSize, height: masterSize, borderRadius: masterSize / 2 }}
                        resizeMode="cover"
                    />
                </View>

                {Platform.OS === "web" ? (
                    <a
                        className="master-link"
                        href="http://www.penofchaos.com/warham/donjon.htm"
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "none" }}
                    >
                        <Text style={styles.username}>Pen Of Chaos</Text>
                    </a>
                ) : (
                    <Text
                        style={styles.username}
                        onPress={() => Linking.openURL("http://www.penofchaos.com/warham/donjon.htm")}
                    >
                        Pen Of Chaos
                    </Text>
                )}

                <View style={styles.masterBadge}>
                    <Text style={styles.masterBadgeText}>✦ Maître du Donjon ✦</Text>
                </View>
            </Animated.View>

            <Divider />

            {/* ── Hero grid ── */}
            <Text style={styles.sectionLabel}>Les Aventuriers</Text>
            <View style={styles.heroList}>
                {HEROES.map((h, i) => (
                    <HeroCard
                        key={h.path}
                        path={h.path}
                        name={h.name}
                        delay={240 + i * 70}
                        cardSize={cardSize}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: COLORS.MainBack,
    },
    content: {
        paddingTop: 56,
        paddingHorizontal: 24,
    },

    // Header
    headerBlock: {
        alignItems: "center",
    },
    eyebrow: {
        color: COLORS.MainText,
        opacity: 0.45,
        fontSize: 11,
        letterSpacing: 3,
        textTransform: "uppercase",
        marginBottom: 6,
    },
    headerText: {
        fontSize: 38,
        fontWeight: "900",
        color: COLORS.MainText,
        letterSpacing: 2,
        textTransform: "uppercase",
    },

    // Dungeon master
    masterBlock: {
        alignItems: "center",
        paddingVertical: 8,
    },
    masterFrame: {
        borderWidth: 2,
        borderColor: COLORS.MainText,
        opacity: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
        // Glow-like shadow
        shadowColor: COLORS.MainText,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    username: {
        fontWeight: "800",
        fontSize: 22,
        color: COLORS.MainText,
        letterSpacing: 1,
        marginBottom: 6,
    },
    masterBadge: {
        borderWidth: 1,
        borderColor: COLORS.MainText,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 4,
        opacity: 0.6,
    },
    masterBadgeText: {
        color: COLORS.MainText,
        fontSize: 11,
        letterSpacing: 2,
        textTransform: "uppercase",
    },

    // Section label
    sectionLabel: {
        color: COLORS.MainText,
        opacity: 0.4,
        fontSize: 10,
        letterSpacing: 3,
        textTransform: "uppercase",
        textAlign: "center",
        marginBottom: 16,
    },

    // Hero grid
    heroList: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    heroContainer: {
        alignItems: "center",
        paddingVertical: 10,
    },
    heroFrame: {
        borderWidth: 1.5,
        borderColor: COLORS.MainText,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        opacity: 0.9,
        shadowColor: COLORS.MainText,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    heroName: {
        fontSize: 10,
        fontWeight: "700",
        textAlign: "center",
        color: COLORS.MainText,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        opacity: 0.85,
    },
    heroDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.MainText,
        opacity: 0.3,
        marginTop: 4,
    },
});

export default Heroes;