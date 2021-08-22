import { colorDefinitions } from './modules/colors.js'
import { shuffleArray, getNumberBetween } from './modules/arrayUtils.js'
import { fetchSvgFiles } from './modules/imageFetching.js'
import { calcTimeDifference } from './modules/timeUtils.js'

let colorIndex = 0;
let shapeCounter = 0;
const experimentResult = [];
let svgArray;


function prepareScreens() {

    experimentResult.push({});

    createPauseStep(svgArray);

}

// TODO rework this
function createPauseStep() {
    const experimentByColor = experimentResult[colorIndex];
    let foundNextPauseButton = false;
    let randomIndex;
    while (!foundNextPauseButton) {
        randomIndex = getNumberBetween(0, svgArray.length)

        if (!svgArray[randomIndex].wasPauseButton) {
            experimentByColor.steps = [];
            experimentByColor.steps[shapeCounter] = {};

            experimentByColor
                .steps[shapeCounter]
                .svgInfo = svgArray[randomIndex]
            experimentByColor.colors = colorDefinitions[colorIndex]
            foundNextPauseButton = true
            svgArray[randomIndex].wasPauseButton = true
        }
    }


    const pauseStepContainer = document.querySelector('.pauseStep');
    pauseStepContainer.innerHTML = setUpColorsForSvg(
        experimentByColor
            .steps[shapeCounter]
            .svgInfo.svgContent
    )
    setPauseStepVisibility('block')
    setTimeout(() => {
        setPauseStepVisibility('none')
        createGridStep();
        setGridVisibility('grid')
        startGridTimmer();
    }, 2000)

    console.log('fileName > ', experimentByColor
        .steps[shapeCounter]
        .svgInfo.fileName
    )
}

function startGridTimmer() {
    const experimentByColor = experimentResult[colorIndex];
    const shapeThatWeAreLookingFor = experimentByColor.steps[shapeCounter];
    shapeThatWeAreLookingFor.startTimeOnGrid = new Date();
}

function createGridStep() {
    const container = document.querySelector(".container");
    container.innerHTML = ''
    svgArray = shuffleArray(svgArray)
    for (const index in svgArray) {
        // container.innerHTML = container.innerHTML + svgArray[index].svgContent
        const svg = document.createElement('div');
        svg.innerHTML = setUpColorsForSvg(svgArray[index].svgContent)
        svg.onclick = () => {
            const experimentByColor = experimentResult[colorIndex];
            const shapeThatWeAreLookingFor = experimentByColor.steps[shapeCounter];
            const shapeFound = svgArray[index].fileName === shapeThatWeAreLookingFor.svgInfo.fileName;

            if (shapeFound) {
                console.log('found it ')
                setGridVisibility('none')

                shapeThatWeAreLookingFor.timeSpentOnScreen = calcTimeDifference(shapeThatWeAreLookingFor.startTimeOnGrid)

                shapeCounter = shapeCounter + 1;
                if (shapeCounter > svgArray.length) {
                    console.log('by bruh');
                    return;
                }
                createPauseStep(svgArray)
                setPauseStepVisibility('block')

                console.log('experiment > ', experimentResult)
            } else {
                console.log('WRONG')
                if (isNaN(shapeThatWeAreLookingFor.missClicks)) {
                    shapeThatWeAreLookingFor.missClicks = 1;
                } else {
                    shapeThatWeAreLookingFor.missClicks = shapeThatWeAreLookingFor.missClicks + 1;
                }
            }
        }

        container.appendChild(svg)
    }
}


function setUpColorsForSvg(svgContent) {
    const experimentByColor = experimentResult[colorIndex];

    const startStyleTag = svgContent.indexOf('<style')
    const endStyleTag = svgContent.indexOf('</style>')
    // TODO make this nicer, its horrible
    return svgContent.substring(0, startStyleTag) +
        `<style>.cls-1{fill:${experimentByColor.colors[0].innerColor};}.cls-2{fill:${experimentByColor.colors[0].outerColor};}</style>`
        + svgContent.substring(endStyleTag, svgContent.length);
}

function setPauseStepVisibility(visibility) {
    const pauseStepContainer = document.querySelector('.pauseStep');
    pauseStepContainer.style.display = visibility
}

function setGridVisibility(visibility) {
    const grid = document.querySelector('.container');
    grid.style.display = visibility
}


async function start() {
    svgArray = shuffleArray(
        await fetchSvgFiles()
    )

    prepareScreens()

    // injectSVG(svgImages)

    // console.log(colorDefinitions)
}

start()