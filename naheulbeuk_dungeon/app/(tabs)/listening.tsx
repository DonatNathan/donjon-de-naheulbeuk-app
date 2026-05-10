import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAudioPlayer } from "expo-audio";
import { useFocusEffect } from "expo-router";

import { COLORS } from "../../other/colors";
import podcasts from "../../assets/files/podcasts.json";

// ─── Web hover styles ─────────────────────────────────────────────────────────
if (Platform.OS === "web" && typeof document !== "undefined") {
    const id = "player-hover-styles";
    if (!document.getElementById(id)) {
        const el = document.createElement("style");
        el.id = id;
        el.textContent = `
      .ctrl-btn {
        cursor: pointer;
        transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease;
        background: none;
        border: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
      .ctrl-btn:hover  { transform: scale(1.15); opacity: 0.85; }
      .ctrl-btn:active { transform: scale(0.88); opacity: 0.65;
        transition: transform 0.07s ease, opacity 0.07s ease; }
      .back-btn {
        cursor: pointer;
        transition: transform 0.15s ease, opacity 0.15s ease;
        background: none; border: none; padding: 0;
        display: flex; align-items: center;
        -webkit-tap-highlight-color: transparent;
      }
      .back-btn:hover  { transform: translateX(-3px); opacity: 0.7; }
      .back-btn:active { transform: translateX(-5px) scale(0.92); }
    `;
        document.head.appendChild(el);
    }
}

// ─── Types ────────────────────────────────────────────────────────────────────
type MusicPlayerProps = {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    track: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const BASE = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${("0" + Math.round(s % 60)).slice(-2)}`;

const useFadeIn = (delay = 0) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(24)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, delay, tension: 55, friction: 9, useNativeDriver: true }),
        ]).start();
    }, []);
    return { opacity, transform: [{ translateY }] };
};

// ─── Control button (web <button> / native Pressable) ─────────────────────────
const CtrlBtn = ({
    name,
    size,
    onPress,
}: {
    name: React.ComponentProps<typeof Ionicons>["name"];
    size: number;
    onPress: () => void;
}) => {
    const scale = useRef(new Animated.Value(1)).current;
    const pressIn = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, tension: 200, friction: 10 }).start();
    };
    const pressOut = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 5 }).start();
    };

    if (Platform.OS === "web") {
        return (
            <button className="ctrl-btn" onClick={onPress}>
                <Ionicons name={name} size={size} color={COLORS.MainText} />
            </button>
        );
    }
    return (
        <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <Ionicons name={name} size={size} color={COLORS.MainText} />
            </Animated.View>
        </Pressable>
    );
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
    row: { flexDirection: "row", alignItems: "center", marginVertical: 16, paddingHorizontal: 32 },
    line: { flex: 1, height: 1, backgroundColor: COLORS.MainText, opacity: 0.15 },
    gem: { color: COLORS.MainText, opacity: 0.35, marginHorizontal: 12, fontSize: 11 },
});

// ─── Music Player ─────────────────────────────────────────────────────────────
const MusicPlayer: React.FC<MusicPlayerProps> = ({ setPage, track }) => {
    const { width, height } = useWindowDimensions();
    const podcastsCount = podcasts.length;

    const [trackIndex, setTrackIndex] = useState(track);
    const [isPause, setIsPause] = useState(false);
    const [soundPosition, setSoundPosition] = useState(0);
    const [soundDuration, setSoundDuration] = useState(0);

    const episode = podcasts[trackIndex];
    const player = useAudioPlayer(`${BASE}episodes/${episode.url}`);

    // ── Stop playback when the screen loses focus (back to library, hero tab, etc.)
    useFocusEffect(
        React.useCallback(() => {
            // Screen gained focus — (re)start if not paused
            if (!isPause) player.play();

            return () => {
                // Screen lost focus — pause & reset
                player.pause();
            };
        }, [player, isPause])
    );

    // ── Load & play when track changes
    useEffect(() => {
        player.pause();
        player.replace(`${BASE}episodes/${episode.url}`);
        player.play();
        setIsPause(false);
        setSoundPosition(0);
    }, [trackIndex]);

    // ── Poll playback position & auto-advance
    useEffect(() => {
        const interval = setInterval(() => {
            setSoundPosition(player.currentTime);
            setSoundDuration(player.duration ?? 0);
            if (player.duration && player.currentTime >= player.duration - 0.2) {
                setTrackIndex((i) => Math.min(i + 1, podcastsCount - 1));
            }
        }, 500);
        return () => clearInterval(interval);
    }, [player, trackIndex]);

    // ── Play on mount
    useEffect(() => {
        player.play();
    }, []);

    const togglePlay = () => {
        if (isPause) { player.play(); setIsPause(false); }
        else         { player.pause(); setIsPause(true); }
    };

    // Artwork pulse animation when track changes
    const artworkScale = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.sequence([
            Animated.timing(artworkScale, { toValue: 0.92, duration: 120, useNativeDriver: true }),
            Animated.spring(artworkScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        ]).start();
    }, [trackIndex]);

    // Responsive artwork size
    const artSize = Math.min(width * 0.68, 300);

    const headerAnim = useFadeIn(0);
    const artworkAnim = useFadeIn(100);
    const infoAnim = useFadeIn(200);
    const controlsAnim = useFadeIn(300);

    // Progress percentage for the decorative bar
    const progress = soundDuration > 0 ? soundPosition / soundDuration : 0;

    return (
        <View style={styles.screen}>
            {/* ── Header ── */}
            <Animated.View style={[styles.header, headerAnim]}>
                {Platform.OS === "web" ? (
                    <button className="back-btn" onClick={() => { player.pause(); setPage("Library"); }}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.MainText} />
                    </button>
                ) : (
                    <Pressable onPress={() => { player.pause(); setPage("Library"); }} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.MainText} />
                    </Pressable>
                )}

                <View style={styles.headerCenter}>
                    <Text style={styles.eyebrow}>En cours de lecture</Text>
                </View>

                {/* Spacer to balance the back button */}
                <View style={{ width: 40 }} />
            </Animated.View>

            <Divider />

            {/* ── Artwork ── */}
            <Animated.View style={[styles.artworkWrapper, artworkAnim]}>
                <Animated.View style={[
                    styles.artworkFrame,
                    { width: artSize, height: artSize, borderRadius: 16 },
                    { transform: [{ scale: artworkScale }] },
                ]}>
                    <Image
                        source={{ uri: `${BASE}images/${episode.artwork}` }}
                        style={{ width: artSize, height: artSize, borderRadius: 16 }}
                        resizeMode="cover"
                    />
                </Animated.View>
            </Animated.View>

            {/* ── Song info ── */}
            <Animated.View style={[styles.songInfo, infoAnim]}>
                <Text style={styles.songTitle} numberOfLines={2}>{episode.title}</Text>
                <Text style={styles.songArtist}>{episode.artist}</Text>
            </Animated.View>

            <Divider />

            {/* ── Progress ── */}
            <Animated.View style={[styles.progressBlock, controlsAnim]}>
                <Slider
                    value={soundPosition}
                    minimumValue={0}
                    maximumValue={soundDuration || 1}
                    thumbTintColor={COLORS.MainText}
                    minimumTrackTintColor={COLORS.MainText}
                    maximumTrackTintColor={`${COLORS.MainText}30`}
                    onSlidingComplete={(value) => player.seekTo(value)}
                    style={styles.slider}
                />
                <View style={styles.timeRow}>
                    <Text style={styles.timeText}>{formatTime(soundPosition)}</Text>
                    <Text style={styles.timeText}>{formatTime(soundDuration)}</Text>
                </View>
            </Animated.View>

            {/* ── Controls ── */}
            <Animated.View style={[styles.controls, controlsAnim]}>
                <CtrlBtn
                    name="play-skip-back"
                    size={30}
                    onPress={() => setTrackIndex((i) => Math.max(i - 1, 0))}
                />
                <CtrlBtn
                    name={isPause ? "play-circle" : "pause-circle"}
                    size={80}
                    onPress={togglePlay}
                />
                <CtrlBtn
                    name="play-skip-forward"
                    size={30}
                    onPress={() => setTrackIndex((i) => Math.min(i + 1, podcastsCount - 1))}
                />
            </Animated.View>
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.MainBack,
        paddingTop: 56,
        paddingBottom: 100,
        justifyContent: "space-between",
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerCenter: {
        alignItems: "center",
    },
    eyebrow: {
        color: COLORS.MainText,
        opacity: 0.4,
        fontSize: 10,
        letterSpacing: 3,
        textTransform: "uppercase",
    },
    headerTitle: {
        color: COLORS.MainText,
        fontWeight: "900",
        fontSize: 18,
        letterSpacing: 2,
        textTransform: "uppercase",
    },

    // Artwork
    artworkWrapper: {
        alignItems: "center",
    },
    artworkFrame: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 20,
        elevation: 12,
        borderWidth: 1,
        borderColor: `${COLORS.MainText}20`,
    },

    // Song info
    songInfo: {
        alignItems: "center",
        paddingHorizontal: 32,
    },
    songTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.MainText,
        textAlign: "center",
        letterSpacing: 0.3,
        marginBottom: 6,
    },
    songArtist: {
        fontSize: 13,
        color: COLORS.MainText,
        opacity: 0.5,
        letterSpacing: 1,
        textTransform: "uppercase",
    },

    // Progress
    progressBlock: {
        paddingHorizontal: 24,
    },
    slider: {
        width: "100%",
        height: 36,
    },
    timeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        marginTop: -4,
    },
    timeText: {
        color: COLORS.MainText,
        opacity: 0.45,
        fontSize: 12,
        letterSpacing: 0.5,
    },

    // Controls
    controls: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 32,
    },
});

export default MusicPlayer;