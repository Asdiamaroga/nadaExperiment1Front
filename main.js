import { startTheCircleTest } from './experiments/circle.js'
import { startShapesExperiment } from './experiments/shapes.js'

const EXPERIMENT = {
    CIRCLE: 'CIRCLE',
    SHAPE: 'SHAPE'
}

function startExpepriment(type, colors, text) {
    if (type === EXPERIMENT.CIRCLE) {
        startTheCircleTest(text)
    } else if (type === EXPERIMENT.SHAPE) {
        startShapesExperiment()
    }
}


function createExpeprimentButton(parrent, text, type, colors) {
    let experiment = document.createElement('button');
    experiment.classList = ['experimentButton']
    experiment.innerHTML = text
    experiment.onclick = (event) => {
        const experiment = document.querySelector('.experiments');
        experiment.style.display = 'none'
        startExpepriment(type, colors, text)
    }

    parrent.appendChild(experiment)
}


function setUpExperimentOptionsScreen() {
    const experimentOptionsContainer = document.querySelector('.experiments');

    createExpeprimentButton(
        experimentOptionsContainer,
        'A',
        EXPERIMENT.CIRCLE,
        'A'
    )
    createExpeprimentButton(experimentOptionsContainer, 'S', 'A', 'A')
    createExpeprimentButton(experimentOptionsContainer, 'Ao', 'A', 'A')
    createExpeprimentButton(experimentOptionsContainer, 'So', 'A', 'A')
    createExpeprimentButton(experimentOptionsContainer, 'RGp', 'A', 'A')
    createExpeprimentButton(experimentOptionsContainer, 'BKp', 'A', 'A')
    createExpeprimentButton(experimentOptionsContainer, 'RGn', 'A', 'A')
    createExpeprimentButton(experimentOptionsContainer, 'BKn', 'A', 'A')

}

setUpExperimentOptionsScreen();