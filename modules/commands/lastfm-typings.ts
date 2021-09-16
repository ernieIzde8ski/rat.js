type MBIDText = { mbid: string, "#text": string };
type SizeText = { size: "small" | "medium" | "large" | "extralarge", "#text": string }
type _Date = { uts: string, "#text": string }
type LastFMRecentResponse = {
    recenttracks: {
        "@attr": {
            page: string,
            perPage: string,
            user: string,
            total: string,
            totalPages: string
        },
        track: Array<{
            artist: MBIDText,
            album: MBIDText,
            image: Array<SizeText>,
            streamable: string,
            date?: _Date,
            url: string,
            name: string,
            mbid: string,
            "@attr"?: { nowplaying: "true" | "false" }
        }>
    }
};
export type LastFMRecentResponses = LastFMRecentResponse | { error: number, message: string };
