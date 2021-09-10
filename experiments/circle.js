import { noBorderImages, borderImages } from './modules/circleImages.js'
import { noBorders } from './modules/circleColors.js'
import { getNumberBetween, shuffleArray } from '../utils/arrayUtils.js'
import { calcTimeDifference } from '../utils/timeUtils.js'


const NUMBER_OF_IMAGES = 12;
const experimentResults = []
let indexOfColorCombination = 0;
let indexOfSteps = 0;
let text;
let imagesToShow;

// #lazy, i just cant
let toBeSelectedImages;
const toBeSelectedImagesNoBorders = [
    {
        name: 'bez okvira-43.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-44.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-47.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-48.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-51.svg',
        wasSelected: false
    },
    {
        name: 'bez okvira-52.svg',
        wasSelected: false
    },
]

const toBeSelectedImagesWithBorders = [
    {
        name: 'sa_okvirom-55.svg',
        wasSelected: false
    },
    {
        name: 'sa_okvirom-56.svg',
        wasSelected: false
    },
    {
        name: 'sa_okvirom-59.svg',
        wasSelected: false
    },
    {
        name: 'sa_okvirom-60.svg',
        wasSelected: false
    },
    {
        name: 'sa_okvirom-63.svg',
        wasSelected: false
    },
    {
        name: 'sa_okvirom-64.svg',
        wasSelected: false
    },
]

function startTheCircleTest(textRecieved) {
    text = textRecieved
    if (text == 'A' || text == 'S') {
        imagesToShow = noBorderImages
        toBeSelectedImages = toBeSelectedImagesNoBorders
    } else {
        imagesToShow = borderImages
        toBeSelectedImages = toBeSelectedImagesWithBorders
    }
    showContainer()
    setUpExperiment()
}

function showContainer() {
    const container = document.querySelector(".circle-container");
    container.style.display = 'block'
}

function setUpExperiment() {
    experimentResults.push([])

    createPauseStep()
}

function createPauseStep() {
    let found = false;
    // TODO super bad, rework
    let index = getNumberBetween(0, 5);
    while (!found) {
        if (!toBeSelectedImages[index].wasSelected) {

            const experimentByColorCombo = experimentResults[indexOfColorCombination]
            experimentByColorCombo.push({})
            const experimentByStep = experimentByColorCombo[indexOfSteps]

            experimentByStep.image = toBeSelectedImages[index].name
            experimentByStep.color = noBorders[text][indexOfColorCombination][index]
            experimentByStep.startTime = new Date()
            found = true;
            toBeSelectedImages[index].wasSelected = true
        } else {
            index = (index + 1) % 6
        }
    }

    const pauseStep = document.querySelector('.pauseStep')
    pauseStep.innerHTML = ''

    const pauseButton = createImageWithColors(0, index);
    pauseButton.style = ''
    pauseButton.classList = ['centered']
    pauseButton.onclick = () => {}
    pauseButton.innerHTML = pauseButton.innerHTML.replace('viewBox="0 0 60 60"', '') // I don't care, I don't have time for this

    setPauseStepVisibility('block')
    setCircleContainerVisibility('none')
    setTimeout(()=> {
        setPauseStepVisibility('none')
        setUpCircles()
        setCircleContainerVisibility('block')
    }, 2000)


    pauseStep.appendChild(pauseButton)

}

function setPauseStepVisibility(visibility) {
    const pauseStepContainer = document.querySelector('.pauseStep');
    pauseStepContainer.style.display = visibility
}

function setCircleContainerVisibility(visibility) {
    const grid = document.querySelector('.circle-container');
    grid.style.display = visibility
}

function setEnd(visibility) {
    const grid = document.querySelector('.end');
    grid.style.display = visibility
}

function setUpCircles() {
    const container = document.querySelector(".circle-container");
    container.innerHTML = ''


    let degreeAngle = 360 / NUMBER_OF_IMAGES;
    let currentAngle = 0;

    let buttons = []
    for (var index = 0; index < NUMBER_OF_IMAGES; index++) {
        /* add to the wrapper */
        buttons.push(createImageWithColors(currentAngle, index))
    }

    buttons = shuffleArray(buttons)

    for(let circleElement of buttons) {
        circleElement.classList = ['circle']
        circleElement.style = "transform: rotate(" + currentAngle + "deg)" +
            "translate(24em)" +
            "rotate(-" + currentAngle + "deg);"

        container.appendChild(circleElement);

        currentAngle = currentAngle + degreeAngle;
    }
    
        /* increment the angle incrementer */
        

    
}

function createImageWithColors(currentAngle, index) {
    const circleElement = document.createElement('div')
    circleElement.innerHTML = addColors(
        cleanUpSvgContent(imagesToShow[index].content),
        index
    )

    circleElement.onclick = () => {
        const experimentByColorCombo = experimentResults[indexOfColorCombination]    
        const experimentByStep = experimentByColorCombo[indexOfSteps]

        if(imagesToShow[index].name === experimentByStep.image) {
            console.log('correct')
            indexOfSteps = indexOfSteps + 1


            experimentByStep.timeSpentOnScreen = calcTimeDifference(experimentByStep.startTime)
            delete experimentByStep.startTime

            if (indexOfSteps === 6) {
                indexOfSteps = 0;
                indexOfColorCombination += 1
        
                experimentResults.push([])
                for(let i = 0; i < toBeSelectedImages.length; i++) {
                    toBeSelectedImages[i].wasSelected = false
                }
                createPauseStep()
            } else if (indexOfColorCombination === 4){
                setCircleContainerVisibility('none')
                setEnd('block')
            } else {
                createPauseStep()
            }
            
        } else {
            console.log('WRONG')
            if (isNaN(experimentByStep.mistakes)) {
                experimentByStep.mistakes = 1
            } else {
                experimentByStep.mistakes += 1
            }
            
        }

        console.log(experimentResults)
    }


    return circleElement;

}

function addColors(svgContent, index) {
    const colorForCurrentTest = noBorders[text];
    const currentColorCombo = colorForCurrentTest[indexOfColorCombination];

    const currentIndex = index % 6
    const colorsToAdd = currentColorCombo[currentIndex]
    return svgContent
        .replace('fill="#box"', 'class="cls-1"')
        .replace('fill="#phone"', 'class="cls-2"') // mistakes were made here
        .replace('class="cls-1"', 'fill="' + colorsToAdd.filler + '"')
        .replace('class="cls-2', 'fill="' + colorsToAdd.phone + '"')
        .replace('class="cls-3', 'fill="' + colorsToAdd.border + '"')
}

function cleanUpSvgContent(svgContent) {
    const startStyleTag = svgContent.indexOf('<style')
    const endStyleTag = svgContent.indexOf('</style>')

    const partialResult = svgContent.substring(0, startStyleTag) + svgContent.substring(endStyleTag, svgContent.length);
    
    const titleStart = partialResult.indexOf('<title>')
    const titleEnd = partialResult.indexOf('</title>')

    return partialResult.substring(0, titleStart) +
    partialResult.substring(titleEnd, partialResult.length);
}

export const name = 'circlesExperiment'
export { startTheCircleTest }