import { colorDefinitions } from './modules/colors.js'
import { shuffleArray, getNumberBetween } from '../utils/arrayUtils.js'
import { fetchSvgFiles } from './modules/imageFetching.js'
import { calcTimeDifference } from '../utils/timeUtils.js'
import { images } from './modules/shapesImages.js'

const NUMBER_OF_IMAGES = 18;
let colorIndex = 0;
let shapeCounter = 0;
const experimentResult = [];
let svgArray;

function prepareScreens(experiment) {

    experimentResult.push({});

    createPauseStep(experiment);

}

// TODO rework this, can be infinite loop
function createPauseStep(experiment) {
    const experimentByColor = experimentResult[colorIndex];
    experimentByColor.colors = colorDefinitions[experiment]
    if (!experimentByColor.steps) {
        experimentByColor.steps = []
    }

    let foundNextPauseButton = false;
    let randomIndex = getNumberBetween(0, svgArray.length)
    while (!foundNextPauseButton) {
        console.log('LOOOOOOOOOOOOOOOOOOOOOOOOOOOP')


        if (!svgArray[randomIndex].wasPauseButton) {
            experimentByColor.steps.push({});

            experimentByColor
                .steps[shapeCounter]
                .svgInfo = svgArray[randomIndex]
            foundNextPauseButton = true
            svgArray[randomIndex].wasPauseButton = true
        } else {
            randomIndex = (randomIndex + 1) % svgArray.length;
        }
    }


    const pauseStepContainer = document.querySelector('.pauseStep');
    pauseStepContainer.innerHTML = setUpColorsForSvg(
        experimentByColor
            .steps[shapeCounter]
            .svgInfo.content
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
        .svgInfo.name
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

    let newButtons = []
    // svgArray = shuffleArray(svgArray)
    for (const index in svgArray) {
        // container.innerHTML = container.innerHTML + svgArray[index].content
        const svg = document.createElement('div');
        svg.innerHTML = setUpColorsForSvg(svgArray[index].content)
        svg.onclick = () => {
            const experimentByColor = experimentResult[colorIndex];
            const shapeThatWeAreLookingFor = experimentByColor.steps[shapeCounter];
            const shapeFound = svgArray[index].name === shapeThatWeAreLookingFor.svgInfo.name;

            if (shapeFound) {
                console.log('found it ')
                setGridVisibility('none')

                shapeThatWeAreLookingFor.timeSpentOnScreen = calcTimeDifference(shapeThatWeAreLookingFor.startTimeOnGrid)
                delete shapeThatWeAreLookingFor.startTimeOnGrid

                console.log('experiment > ', experimentResult)
                shapeCounter = shapeCounter + 1;
                if (shapeCounter >= svgArray.length) {
                    // experimentResult.push({});
                    // colorIndex = colorIndex + 1;
                    // debugger;
                    // shapeCounter = 0;

                    // for (let svg of svgArray) {
                    //     svg.wasPauseButton = false
                    // }

                    console.log('by bruh');
                    return;
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

        newButtons.push(svg)
        // container.appendChild(svg)
    }

    // TODO return
    // newButtons = shuffleArray(newButtons)
    for (const button of newButtons) {
        container.appendChild(button)
    }
}


function setUpColorsForSvg(svgContent) {
    const experimentByColor = experimentResult[colorIndex];

    const startStyleTag = svgContent.indexOf('<style')
    const endStyleTag = svgContent.indexOf('</style>')
    // TODO make this nicer, its horrible
    console.log(experimentByColor.colors.innerColor)
    console.log(experimentByColor.colors.outerColor)


    const partialResult = svgContent.substring(0, startStyleTag) +
        svgContent.substring(endStyleTag, svgContent.length);


    return partialResult
        .replace('fill="#inner"', `fill="${experimentByColor.colors.innerColor}"`)
        .replace('fill="#outer"', `fill="${experimentByColor.colors.outerColor}"`)
        .replace('0 0 60 60', '')
}

function setPauseStepVisibility(visibility) {
    const pauseStepContainer = document.querySelector('.pauseStep');
    pauseStepContainer.style.display = visibility
}

function setGridVisibility(visibility) {
    const grid = document.querySelector('.container');
    grid.style.display = visibility
}


async function startShapesExperiment(experiment) {
    svgArray = images

    prepareScreens(experiment)

    // injectSVG(svgImages)

    // console.log(colorDefinitions)
}

export const name = 'shapesExperiment'
export { startShapesExperiment }