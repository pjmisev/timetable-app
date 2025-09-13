import puppeteer, { Page, Target } from 'puppeteer';
import * as cheerio from 'cheerio';

interface TimetableEntry {
    [key: string]: string;
    Day: string;
}

export async function fetchClassTimetable(
    classId: string = 'P1139',
    week: string = '8'
): Promise<TimetableEntry[]> {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const [page] = await browser.pages();
        await page.goto('https://timetables.dkit.ie/studentset.php', {
            waitUntil: 'domcontentloaded',
        });

        // Wait for the form to load completely
        await page.waitForSelector('select[name="identifier"]', { timeout: 10000 });
        await page.waitForSelector('select[name="weeks"]', { timeout: 10000 });
        await page.waitForSelector('select[name="style"]', { timeout: 10000 });

        // Select form options
        await Promise.all([
            page.select('select[name="identifier"]', classId),
            page.select('select[name="weeks"]', week),
            page.select('select[name="style"]', 'textspreadsheet'),
        ]);

        // Handle any potential dialogs
        page.on('dialog', async (dialog) => await dialog.accept());

        // Set up promise to catch the new tab
        const newPagePromise = new Promise<Page>((resolve) =>
            browser!.once('targetcreated', async (target: Target) => {
                const newPage = await target.page();
                resolve(newPage!);
            })
        );

        // Trigger the timetable view
        await page.click('input[type="button"][value="View Timetable"]');

        const timetablePage = await newPagePromise;
        await timetablePage.waitForSelector('table[border="1"]', {
            timeout: 15000,
        });

        // Parse the HTML
        const html = await timetablePage.content();
        const $ = cheerio.load(html);

        const timetable: TimetableEntry[] = [];

        // Find all day sections
        $('p').each((_, element) => {
            const text = $(element).text().trim();
            const dayMatch = text.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday)$/);

            if (dayMatch) {
                const day = dayMatch[0];
                const table = $(element).next('table[border="1"]');

                if (table.length) {
                    const rows = table.find('tr');
                    const headers: string[] = [];

                    // Get headers from first row
                    rows.eq(0).find('td').each((_, cell) => {
                        const text = $(cell).text().trim();
                        headers.push(text === '' ? 'Type' : text);
                    });

                    // Process data rows
                    rows.slice(1).each((_, row) => {
                        const cells = $(row).find('td');
                        if (cells.length === 0) return;

                        const entry: TimetableEntry = { Day: day };
                        cells.each((j, cell) => {
                            const header = headers[j] || `Column_${j}`;
                            entry[header] = $(cell).text().trim();
                        });
                        timetable.push(entry);
                    });
                }
            }
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