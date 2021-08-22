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

    createPauseStep();

}

// TODO rework this, can be infinite loop
function createPauseStep() {
    const experimentByColor = experimentResult[colorIndex];
    experimentByColor.colors = colorDefinitions[colorIndex]
    if (!experimentByColor.steps) {
        experimentByColor.steps = []
    }

    let foundNextPauseButton = false;
    let randomIndex;
    while (!foundNextPauseButton) {
        console.log('LOOOOOOOOOOOOOOOOOOOOOOOOOOOP')
        randomIndex = getNumberBetween(0, svgArray.length)

        if (!svgArray[randomIndex].wasPauseButton) {
            experimentByColor.steps.push({});

            experimentByColor
                .steps[shapeCounter]
                .svgInfo = svgArray[randomIndex]
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
                delete shapeThatWeAreLookingFor.startTimeOnGrid

                console.log('experiment > ', experimentResult)
                shapeCounter = shapeCounter + 1;
                if (shapeCounter >= svgArray.length) {
                    experimentResult.push({});
                    colorIndex = colorIndex + 1;
                    debugger;
                    shapeCounter = 0;

                    for (let svg of svgArray) {
                        svg.wasPauseButton = false
                    }
                }

                if (colorIndex >= colorDefinitions.length) {
                    console.log('by bruh');
                    // TODO. probably thank you or smth
                    return;
                }


                createPauseStep()
                setPauseStepVisibility('block')
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
    console.log(experimentByColor.colors[0].innerColor)
    console.log(experimentByColor.colors[0].outerColor)


    const partialResult = svgContent.substring(0, startStyleTag) +
        svgContent.substring(endStyleTag, svgContent.length);

    return partialResult
        .replace('fill="#ff8080"', `fill="${experimentByColor.colors[0].outerColor}"`)
        .replace('fill="red"', `fill="${experimentByColor.colors[0].innerColor}"`)
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