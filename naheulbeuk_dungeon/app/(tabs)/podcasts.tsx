import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { COLORS } from "../../other/colors";
import MusicPlayer from "./listening";
import podcasts from "../../assets/files/podcasts.json";
import { IoCloseCircleOutline, IoPlay, IoSearchOutline } from "react-icons/io5";

// ─── Web hover styles ─────────────────────────────────────────────────────────
if (Platform.OS === "web" && typeof document !== "undefined") {
    const id = "podcasts-hover-styles";
    if (!document.getElementById(id)) {
        const el = document.createElement("style");
        el.id = id;
        el.textContent = `
      .ep-card {
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                    opacity 0.18s ease;
      }
      .ep-card:hover { transform: translateY(-5px) scale(1.05); }
      .ep-card:active { transform: scale(0.94); opacity: 0.75;
        transition: transform 0.07s ease, opacity 0.07s ease; }
      .season-chip {
        cursor: pointer;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }
      .season-chip:hover { transform: scale(1.08); opacity: 0.85; }
    `;
        document.head.appendChild(el);
    }
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Podcast = {
    url: string;
    title: string;
    artist: string;
    artwork: string;
};

type LibraryProps = {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setTrack: React.Dispatch<React.SetStateAction<number>>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const BASE = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const img = (path: string) => `${BASE}images/${path}`;

const useFadeIn = (delay = 0) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 420, delay, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, delay, tension: 60, friction: 9, useNativeDriver: true }),
        ]).start();
    }, []);
    return { opacity, transform: [{ translateY }] };
};

// Extract season number from URL e.g. "saison1-episode3.mp3" → 1
const getSeason = (url: string): number | null => {
    const m = url.match(/saison(\d+)/i);
    return m ? parseInt(m[1], 10) : null;
};

// Derive sorted unique season list from podcast URLs
const SEASONS: number[] = Array.from(
    new Set(
        (podcasts as Podcast[])
            .map((p) => getSeason(p.url))
            .filter((s): s is number => s !== null)
    )
).sort((a, b) => a - b);

const renderIcon = (name: string, size: number, color: string) => {
    if (Platform.OS === "web") {
        switch (name) {
            case "search-outline":
                return <IoSearchOutline size={size} color={color} />;
            case "close-circle":
                return <IoCloseCircleOutline size={size} color={color} />;
            case "play":
                return <IoPlay size={size} color={color} />;
            default:
                return null;
        }
    }

    return (
        <Ionicons
            name={name as any}
            size={size}
            color={color}
        />
    );
};

// ─── Search bar ───────────────────────────────────────────────────────────────
const SearchBar = ({ search, setSearch }: { search: string; setSearch: (s: string) => void }) => (
    <View style={styles.searchBar}>
        {renderIcon("search-outline", 16, `${COLORS.MainText}66`)}
        <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher…"
            placeholderTextColor={`${COLORS.MainText}55`}
            style={styles.input}
        />
        {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} style={{ paddingRight: 12 }}>
                {renderIcon("close-circle", 16, `${COLORS.MainText}66`)}
            </Pressable>
        )}
    </View>
);

// ─── Season filter chips ──────────────────────────────────────────────────────
const SeasonFilter = ({
    selected,
    onSelect,
}: {
    selected: number | null;
    onSelect: (s: number | null) => void;
}) => {
    if (SEASONS.length === 0) return null;

    const chips = [{ label: "Tout", value: null as number | null }, ...SEASONS.map((s) => ({ label: `Saison ${s}`, value: s }))];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
			style={{ paddingTop: 5 }}
        >
            {chips.map((chip) => {
                const active = chip.value === selected;
                const chipInner = (
                    <View style={[styles.chip, active && styles.chipActive]}>
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                            {chip.label}
                        </Text>
                    </View>
                );
                if (Platform.OS === "web") {
                    return (
                        <div
                            key={String(chip.value)}
                            className="season-chip"
                            onClick={() => onSelect(chip.value)}
                        >
                            {chipInner}
                        </div>
                    );
                }
                return (
                    <Pressable key={String(chip.value)} onPress={() => onSelect(chip.value)}>
                        {chipInner}
                    </Pressable>
                );
            })}
        </ScrollView>
    );
};

// ─── Episode card ─────────────────────────────────────────────────────────────
const EpisodeCard = ({
    episode,
    index,
    cardWidth,
    onPress,
}: {
    episode: Podcast;
    index: number;
    cardWidth: number;
    onPress: () => void;
}) => {
    const anim = useFadeIn(index * 40);
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, tension: 200, friction: 10 }).start();
    };
    const pressOut = () => {
        if (Platform.OS === "web") return;
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 5 }).start();
    };

    const inner = (
        <Animated.View style={[styles.card, anim, { transform: [...(anim.transform as any), { scale }], width: cardWidth }]}>
            <View style={styles.cardImageWrapper}>
                <Image
                    source={{ uri: img(episode.artwork) }}
                    style={{ width: cardWidth, height: cardWidth, borderRadius: 10 }}
                    resizeMode="cover"
                />
                {/* Play overlay */}
                <View style={styles.playOverlay}>
                    <View style={styles.playCircle}>
                        {renderIcon("play", 14, COLORS.MainBack)}
                    </View>
                </View>
            </View>
            <Text style={styles.episodeTitle} numberOfLines={2}>{episode.title}</Text>
            <Text style={styles.episodeArtist} numberOfLines={1}>{episode.artist}</Text>
        </Animated.View>
    );

    if (Platform.OS === "web") {
        return (
            <div className="ep-card" onClick={onPress} style={{ display: "flex" }}>
                {inner}
            </div>
        );
    }
    return (
        <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
            {inner}
        </Pressable>
    );
};

// ─── Library ──────────────────────────────────────────────────────────────────
const Library: React.FC<LibraryProps> = ({ setPage, setTrack }) => {
    const { width } = useWindowDimensions();
    const [search, setSearch] = useState("");
    const [season, setSeason] = useState<number | null>(null);

    const headerAnim = useFadeIn(0);
    const controlsAnim = useFadeIn(100);

    // Responsive grid: 2 cols on narrow, 3 on medium, 4+ on wide
    const cols = width < 420 ? 2 : width < 700 ? 3 : width < 1000 ? 4 : width < 1300 ? 5 : width < 1600 ? 6 : width < 1900 ? 7 : 8;
    const gap = 20;
    const cardWidth = Math.floor((width - 32 - gap * (cols - 1)) / cols);

    const filtered = (podcasts as Podcast[]).filter((p) => {
        const matchSearch =
            search === "" ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.artist.toLowerCase().includes(search.toLowerCase());
        const matchSeason = season === null || getSeason(p.url) === season;
        return matchSearch && matchSeason;
    });

    // Build rows for the grid
    const rows: Podcast[][] = [];
    for (let i = 0; i < filtered.length; i += cols) {
        rows.push(filtered.slice(i, i + cols));
    }

    return (
        <View style={styles.screen}>
            {/* ── Header ── */}
            <Animated.View style={[styles.header, headerAnim]}>
                <Text style={styles.eyebrow}>Le Donjon de Naheulbeuk</Text>
                <Text style={styles.headerText}>Podcasts</Text>
            </Animated.View>

            {/* ── Search + filter ── */}
            <Animated.View style={[controlsAnim]}>
                <SearchBar search={search} setSearch={setSearch} />
                <SeasonFilter selected={season} onSelect={setSeason} />
            </Animated.View>

            {/* ── Episode grid ── */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.grid, { paddingBottom: 120, paddingTop: 20 }]}
            >
                {filtered.length === 0 ? (
                    <View style={styles.empty}>
                        {renderIcon("search", 32, `${COLORS.MainText}33`)}
                        <Text style={styles.emptyText}>Aucun épisode trouvé</Text>
                    </View>
                ) : (
                    rows.map((row, ri) => (
                        <View key={ri} style={[styles.row, { gap }]}>
                            {row.map((ep, ci) => {
                                const globalIndex = ri * cols + ci;
                                return (
                                    <EpisodeCard
                                        key={ep.url}
                                        episode={ep}
                                        index={globalIndex}
                                        cardWidth={cardWidth}
                                        onPress={() => {
                                            setTrack(podcasts.indexOf(ep as any));
                                            setPage("Listening");
                                        }}
                                    />
                                );
                            })}
                            {/* Fill empty cells in last row */}
                            {row.length < cols &&
                                Array(cols - row.length)
                                    .fill(null)
                                    .map((_, i) => <View key={`empty-${i}`} style={{ width: cardWidth }} />)}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const Podcasts = () => {
    const [page, setPage] = useState("Library");
    const [track, setTrack] = useState(0);

    return page === "Library" ? (
        <Library setPage={setPage} setTrack={setTrack} />
    ) : (
        <MusicPlayer setPage={setPage} track={track} />
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.MainBack,
        paddingTop: 56,
    },

    // Header
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    eyebrow: {
        color: COLORS.MainText,
        opacity: 0.4,
        fontSize: 10,
        letterSpacing: 3,
        textTransform: "uppercase",
        marginBottom: 4,
    },
    headerText: {
        fontSize: 34,
        fontWeight: "900",
        color: COLORS.MainText,
        letterSpacing: 2,
        textTransform: "uppercase",
    },

    // Search
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.SecondBack,
        borderRadius: 14,
        marginHorizontal: 16,
		paddingHorizontal: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: `${COLORS.MainText}18`,
    },
    input: {
        flex: 1,
        paddingVertical: 11,
        paddingHorizontal: 8,
        color: COLORS.MainText,
        fontSize: 14,
    },

    // Season chips
    chipRow: {
        paddingHorizontal: 16,
        paddingBottom: 14,
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: `${COLORS.MainText}30`,
        backgroundColor: "transparent",
    },
    chipActive: {
        backgroundColor: COLORS.MainText,
        borderColor: COLORS.MainText,
    },
    chipText: {
        color: COLORS.MainText,
        fontSize: 12,
        letterSpacing: 0.5,
        opacity: 0.6,
    },
    chipTextActive: {
        color: COLORS.MainBack,
        opacity: 1,
        fontWeight: "700",
    },

    // Grid
    grid: {
        paddingHorizontal: 16,
        paddingTop: 4,
    },
    row: {
        flexDirection: "row",
        marginBottom: 20,
    },

    // Card
    card: {
        flexDirection: "column",
    },
    cardImageWrapper: {
        position: "relative",
        marginBottom: 8,
        borderRadius: 10,
        overflow: "hidden",
    },
    playOverlay: {
        position: "absolute",
        bottom: 8,
        right: 8,
    },
    playCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.MainText,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 4,
    },
    episodeTitle: {
        color: COLORS.MainText,
        fontWeight: "700",
        fontSize: 11,
        letterSpacing: 0.2,
        lineHeight: 15,
        marginBottom: 2,
    },
    episodeArtist: {
        color: COLORS.MainText,
        fontSize: 10,
        opacity: 0.5,
        letterSpacing: 0.3,
    },

    // Empty state
    empty: {
        alignItems: "center",
        paddingTop: 60,
        gap: 12,
    },
    emptyText: {
        color: COLORS.MainText,
        opacity: 0.35,
        fontSize: 14,
        letterSpacing: 1,
    },
});

export default Podcasts;