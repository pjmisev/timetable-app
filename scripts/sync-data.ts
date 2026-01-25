import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function sync() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    const dir = './lib/data';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Scrape Classes & Departments
    console.log("Navigating to Student Timetables...");
    await page.goto('https://timetables.dkit.ie/studentset.php', { waitUntil: 'networkidle2' });

    const departments = await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('select[name="filter"] option'));
        return options
            .map(opt => ({ id: (opt as HTMLOptionElement).value, name: opt.textContent?.trim() || "" }))
            .filter(opt => opt.id !== "(None)");
    });

    const allClassMappings = [];
    for (const dept of departments) {
        console.log(`Scraping Classes for: ${dept.name}...`);
        await page.select('select[name="filter"]', dept.id);
        await new Promise(r => setTimeout(r, 400));

        const classes = await page.evaluate((deptId) => {
            const options = Array.from(document.querySelectorAll('select[name="identifier"] option'));
            return options
                .map(opt => ({
                    id: (opt as HTMLOptionElement).value,
                    name: opt.textContent?.trim() || "",
                    departmentId: deptId.toLowerCase()
                }))
                .filter(opt => opt.id !== "");
        }, dept.id);
        allClassMappings.push(...classes);
    }

    // Save Classes to JSON file
    const classData = {
        departments: departments.map(d => ({ id: d.id.toLowerCase(), name: d.name })),
        classes: allClassMappings
    };
    fs.writeFileSync(path.join(dir, 'classes-options.json'), JSON.stringify(classData, null, 2));

    // Scrape Rooms
    console.log("\nNavigating to Room Timetables...");
    await page.goto('https://timetables.dkit.ie/room.php', { waitUntil: 'networkidle2' });

    const zones = await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('select[name="filter"] option'));
        return options
            .map(opt => ({ id: (opt as HTMLOptionElement).value, name: opt.textContent?.trim() || "" }))
            .filter(opt => opt.id !== "(None)");
    });

    const allRoomMappings = [];
    for (const zone of zones) {
        console.log(`Scraping Rooms for: ${zone.name}...`);
        await page.select('select[name="filter"]', zone.id);
        await new Promise(r => setTimeout(r, 400));

        const rooms = await page.evaluate((zoneId) => {
            const options = Array.from(document.querySelectorAll('select[name="identifier"] option'));
            return options
                .map(opt => ({
                    id: (opt as HTMLOptionElement).value,
                    name: opt.textContent?.trim() || "",
                    departmentId: zoneId.toLowerCase()
                }))
                .filter(opt => opt.id !== "");
        }, zone.id);
        allRoomMappings.push(...rooms);
    }

    // Save Rooms to JSON file
    const roomData = {
        departments: zones.map(z => ({ id: z.id.toLowerCase(), name: z.name })),
        rooms: allRoomMappings
    };
    fs.writeFileSync(path.join(dir, 'rooms-options.json'), JSON.stringify(roomData, null, 2));

    console.log(`\nSync complete!`);
    console.log(`- Created: classes-options.json (${allClassMappings.length} classes)`);
    console.log(`- Created: rooms-options.json (${allRoomMappings.length} rooms)`);

    await browser.close();
}

sync();