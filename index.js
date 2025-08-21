#!/usr/bin/env node

import sharp from "sharp";
import { program } from "commander";
import chalk from 'chalk';


program
    .option("-w --calcw", "Calculate image size with width.", false)
    .option("-h --calch", "Calculate image size with height.", true)
    .option("-p --pixel", "Render with pixel size.", false)
    .argument("<string>", "File to render.");
program.parse();
const options = program.opts();
const file = program.args[0];



async function main() {
    let image;
    if (options.calcw) {
        options.calch = false;
    }
    if (options.pixel) {
        let imageArr;
        if (options.calch) {
            let h = (2 * Math.round(process.stdout.rows) - 4) / 2;
            let buffer = await (sharp(file).resize({ height: h }).raw().toBuffer({ resolveWithObject: true }));
            image = buffer.info;
            imageArr = [...buffer.data];
        } else if (options.calcw) {
            let w = ((2 * Math.round(process.stdout.columns) - 2) / 2) / 2;
            let buffer = await (sharp(file).resize({ width: w }).raw().toBuffer({ resolveWithObject: true }));
            image = buffer.info;
            imageArr = [...buffer.data]
        }

        let RGBArr = [];
        for (let i = 0; i < imageArr.length; i += image.channels) {
            let three = [imageArr[i], imageArr[i + 1], imageArr[i + 2]];
            RGBArr.push(three);
        }

        let imgTotal = [];

        for (let y = 0; y < image.height; y++) {
            let pixArray = [];
            for (let x = 0; x < image.width; x++) {
                let v = RGBArr[x + (y * image.width)];
                pixArray.push(chalk.bgRgb(v[0], v[1], v[2])("  "));
            }
            imgTotal.push(pixArray.join(''));
        }
        console.log(imgTotal.join('\n'));
    } else {
        let imageArr
        if (options.calch) {
            let h = 2 * Math.round(process.stdout.rows) - 4;
            let buffer = await (sharp(file).resize({ height: h }).raw().toBuffer({ resolveWithObject: true }));
            image = buffer.info;
            imageArr = [...buffer.data];
        } else if (options.calcw) {
            let w = (2 * Math.round(process.stdout.columns) - 2) / 2;
            let buffer = await (sharp(file).resize({ width: w }).raw().toBuffer({ resolveWithObject: true }));
            image = buffer.info;
            imageArr = [...buffer.data];
        }
        console.log(image);
        let RGBArr = [];
        for (let i = 0; i < imageArr.length; i += image.channels) {
            let three = [imageArr[i], imageArr[i + 1], imageArr[i + 2]];
            RGBArr.push(three);
        }

        let imgTotal = [];
        for (let y = 0; y < image.height; y += 2) {
            let pixArray = [];
            for (let x = 0; x < image.width; x++) {
                let v = RGBArr[x + (y * image.width)];
                let v2 = RGBArr[x + ((y + 1) * image.width)];
                pixArray.push(chalk.bgRgb(v[0], v[1], v[2]).rgb(v2[0], v2[1], v2[2])("▄"));
            }
            imgTotal.push(pixArray.join(''));
        }
        console.log(imgTotal.join('\n'));
    }

}
main();