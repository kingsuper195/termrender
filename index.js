#!/usr/bin/env node

import { Jimp } from "jimp";
import { intToRGBA } from "@jimp/utils";
import { program } from "commander";
import chalk from 'chalk';


program
    .option("-w --calcw", "Calculate image size with width.", false)
    .option("-h --calch", "Calculate image size with height.", true)
    .option("-p --pixel", "Render with pixel size.", false)
    .argument("file <string>", "File to render.");
program.parse();
const options = program.opts();
const file = program.args[0];



async function main() {
    let image;
    try {
        image = await Jimp.read(file);
    } catch (error) {
        return;
    }
    if (options.calcw) {
        options.calch = false;
    }
    if (options.pixel) {
        if (options.calch) {
            let h = (2 * Math.round(process.stdout.rows) - 4) / 2;
            image.resize({ h });
        } else if (options.calcw) {
            let w = ((2 * Math.round(process.stdout.columns) - 2) / 2) / 2;
            image.resize({ w });
        }
        for (let y = 0; y < image.height; y++) {
            let pixArray = [];
            for (let x = 0; x < image.width; x++) {
                let v = intToRGBA(image.getPixelColor(x, y));
                pixArray.push(chalk.bgRgb(v.r, v.g, v.b)("  "));
            }
            console.log(pixArray.join(''));
        }
    } else {
        if (options.calch) {
            let h = 2 * Math.round(process.stdout.rows) - 4;
            image.resize({ h: h });
        } else if (options.calcw) {
            let w = (2 * Math.round(process.stdout.columns) - 2) / 2;
            image.resize({ w: w });
        }



        for (let y = 0; y < image.height; y += 2) {
            let pixArray = [];
            for (let x = 0; x < image.width; x++) {
                let v = intToRGBA(image.getPixelColor(x, y));
                let v2 = intToRGBA(image.getPixelColor(x, y + 1));
                pixArray.push(chalk.bgRgb(v.r, v.g, v.b).rgb(v2.r, v2.g, v2.b)("▄"));
            }
            console.log(pixArray.join(''));
        }
    }

}
main();