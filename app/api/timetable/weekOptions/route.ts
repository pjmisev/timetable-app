import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

interface WeekOption {
    value: string;
    label: string;
}

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }

    let browser: any;

    try {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--no-zygote",
                "--single-process",
            ],
        });

        const page = await browser.newPage();
        await page.goto("https://timetables.dkit.ie/studentset.php", {
            waitUntil: "domcontentloaded",
        });

        await page.waitForSelector('select[name="weeks"]', { timeout: 10000 });

        const html = await page.content();
        const $ = cheerio.load(html);

        const weeks: WeekOption[] = [];
        $('select[name="weeks"] option').each((_, el) => {
            weeks.push({
                value: ($(el).attr("value") || "").trim(),
                label: $(el).text().trim(),
            });
        });

        return NextResponse.json(weeks);
    } catch (error: any) {
        console.error("Failed to scrape weeks:", error?.message || error);
        console.error(error?.stack);
        return NextResponse.json({ error: "Failed to fetch weeks" }, { status: 500 });
    } finally {
        if (browser) await browser.close();
    }
}
