import { colorDefinitions } from './modules/colors.js'
import { shuffleArray, getNumberBetween } from '../utils/arrayUtils.js'
import { calcTimeDifference } from '../utils/timeUtils.js'
import { images } from './modules/shapesImages.js'
import { getQueryParamFromUrl, isPractice } from '../utils/urlUtils.js'

const NUMBER_OF_IMAGES = 4;
let colorIndex = 0;
let shapeCounter = 0;
const experimentResult = [];
let svgArray;
let experimentName;

function prepareScreens(experiment) {

    experimentResult.push({});
    experimentName = experiment
    createPauseStep(experimentName);

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
        setUpCircle();
        setGridVisibility('grid')
        startGridTimmer();
    }, getQueryParamFromUrl())

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

function setUpCircle() {
    const container = document.querySelector(".circle-container");
    container.innerHTML = ''

    let degreeAngle = 360 / svgArray.length;
    let currentAngle = 0;
    // let newButtons = shuffleArray[]
    svgArray = shuffleArray(svgArray)
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

                    setGridVisibility('none')
                    setEnd('block')
                    console.log('by bruh');

                    let payload = {
                        experimentName: experimentName,
                        shapeColors: experimentResult[0].colors,
                        steps: experimentResult[0].steps,
                    }

                    for (let i = 0; i < payload.steps.length; i++) {
                        payload.steps[i].svgInfo.content =
                            JSON.stringify(payload.steps[i].svgInfo.content);
                    }

                    if (!isPractice()) {
                        fetch('https://nada-statistics.herokuapp.com/secondExperiment2', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        })
                    }
                    // fetch('http://localhost:5000/secondExperiment2', {


                    return;
                }

                if (colorIndex >= colorDefinitions.length) {
                    console.log('by bruh');
                    setGridVisibility('none')
                    setEnd('block')
                    // TODO. probably thank you or smth
                    return;
                }


                createPauseStep(experimentName)
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

        svg.classList = ['circle']
        svg.style = "transform: rotate(" + currentAngle + "deg)" +
            "translate(24em)" +
            "rotate(-" + currentAngle + "deg);"

        currentAngle = currentAngle + degreeAngle;
        // newButtons.push(svg)
        container.appendChild(svg)
    }

    // TODO return
    // newButtons = shuffleArray(newButtons)
    // for (const button of newButtons) {
    //     container.appendChild(button)
    // }
}

function setEnd(visibility) {
    const grid = document.querySelector('.end');
    grid.style.display = visibility
}


function setUpColorsForSvg(svgContent) {
    const experimentByColor = experimentResult[colorIndex];

    const startStyleTag = svgContent.indexOf('<style')
    const endStyleTag = svgContent.indexOf('</style>')

    // TODO make this nicer, its horrible
    console.log(experimentByColor.colors.innerColor)
    console.log(experimentByColor.colors.outerColor)


    let partialResult = svgContent.substring(0, startStyleTag) +
        svgContent.substring(endStyleTag, svgContent.length);

    const titleStart = partialResult.indexOf('<title>')
    const titleEnd = partialResult.indexOf('</title>')

    partialResult = partialResult.substring(0, titleStart) +
        partialResult.substring(titleEnd, partialResult.length);

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
    const grid = document.querySelector('.circle-container');
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