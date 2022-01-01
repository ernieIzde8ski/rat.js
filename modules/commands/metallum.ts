import axios from "axios";


async function get_band(link: string = "https://www.metal-archives.com/band/random"): Promise<void> {
    if (!link.startsWith("https://www.metal-archives.com/band/")) link = ("https://www.metal-archives.com/band/view" + link);
    let resp = axios.get(link);
}
