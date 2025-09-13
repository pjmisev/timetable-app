import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { auth } from "@/lib/auth";

interface WeekOption {
    value: string;
    label: string;
}

export async function GET() {

    const session = await auth();

    // Authentication check
    if (!session?.user) {
        return NextResponse.json(
            { error: "Unauthorized - Please log in" },
            { status: 401 }
        );
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const [page] = await browser.pages();
        await page.goto("https://timetables.dkit.ie/studentset.php", {
            waitUntil: "domcontentloaded",
        });

        // Wait for weeks select box
        await page.waitForSelector('select[name="weeks"]', { timeout: 10000 });

        // Extract raw HTML
        const html = await page.content();
        const $ = cheerio.load(html);

        const weeks: WeekOption[] = [];

        $('select[name="weeks"] option').each((_, el) => {
            const value = $(el).attr("value")?.trim() || "";
            const label = $(el).text().trim();
            weeks.push({ value, label });
        });

        return NextResponse.json(weeks);
    } catch (error) {
        console.error("Failed to scrape weeks:", error);
        return NextResponse.json(
            { error: "Failed to fetch weeks" },
            { status: 500 }
        );
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
