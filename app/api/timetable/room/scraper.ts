import puppeteer, { Page, Target } from 'puppeteer';
import * as cheerio from 'cheerio';

interface TimetableEntry {
    [key: string]: string;
    Day: string;
}

export async function fetchRoomTimetable(
    roomId: string = 'P1139',
    week: string = '8'
): Promise<TimetableEntry[]> {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const [page] = await browser.pages();
        await page.goto('https://timetables.dkit.ie/room.php', {
            waitUntil: 'domcontentloaded',
        });

        // Select form options
        await Promise.all([
            page.select('select[name="identifier"]', roomId),
            page.select('select[name="weeks"]', week),
            page.select('select[name="style"]', 'textspreadsheet'),
        ]);

        // Handle any potential dialogs
        page.on('dialog', async (dialog) => await dialog.accept());

        // Set up promise to catch the new tab
        const newPagePromise = new Promise<Page>((resolve) =>
            browser!.once('targetcreated', async (target: Target) => {
                const newPage = await target.page();
                await newPage!.bringToFront();
                resolve(newPage!);
            })
        );

        // Trigger the timetable view
        await page.click('input[type="button"][value="View Timetable"]');
        const timetablePage = await newPagePromise;
        await timetablePage.waitForSelector('table[border="1"]', {
            timeout: 10000,
        });

        // Parse the HTML
        const html = await timetablePage.content();
        const $ = cheerio.load(html);

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const timetable: TimetableEntry[] = [];
        const tables = $("table[border='1']");

        tables.each((i, table) => {
            const day = days[i];
            const rows = $(table).find('tr');
            const headers: string[] = [];

            // Get headers from first row
            rows
                .eq(0)
                .find('td')
                .each((_, cell) => {
                    const text = $(cell).text().trim();
                    headers.push(text === '' ? 'Type' : text);
                });

            // Process data rows
            rows.slice(1).each((_, row) => {
                const cells = $(row).find('td');
                if (cells.length === 0) return;

                const entry: TimetableEntry = { Day: day };
                cells.each((j, cell) => {
                    entry[headers[j]] = $(cell).text().trim();
                });
                timetable.push(entry);
            });
        });

        return timetable;
    } catch (error) {
        console.error('Scraping failed:', error);
        throw new Error('Failed to fetch timetable data');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}