import { colorDefinitions } from './modules/colors.js'
import { shuffleArray } from './modules/arrayUtils.js'

function fetchSvgFiles() {
    const images = [];
    for (let i = 18; i < 34; i++) {
        images.push(
            fetch(`/assets/1-${i}.svg`)
                .then(response => response.text())
        )
    }

    return Promise.all(images);
}

function injectSVG(svgArray) {
    const container = document.querySelector(".container");
    for (const index in svgArray) {
        container.innerHTML = container.innerHTML + svgArray[index]
    }
}

function cleanSVG(svgArray) {
    for (const index in svgArray) {
        const startOfScript = svgArray[index].indexOf('<script')
        const endOfScript = svgArray[index].indexOf('</script>')
        const lenght = svgArray[index].lenght
        svgArray[index] = svgArray[index].substring(0, startOfScript) + svgArray[index].substring(endOfScript, lenght)
    }

    console.log(svgArray)
    svgArray = shuffleArray(svgArray)
}




async function start() {
    const svgImages = await fetchSvgFiles();
    cleanSVG(svgImages)

    injectSVG(svgImages)

    console.log(colorDefinitions)
}

start()