import { startTheCircleTest } from './circle.js'
import { startShapesExperiment } from './shapes.js'

const EXPERIMENT_TYPE = {
    CIRCLE: 'CIRCLE',
    SHAPE: 'SHAPE'
}

function startExpepriment(type, colors) {
    if (type === EXPERIMENT_TYPE.CIRCLE) {
        startTheCircleTest(colors)
    } else if (type === EXPERIMENT_TYPE.SHAPE) {
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
        startExpepriment(type, colors)
    }

    parrent.appendChild(experiment)
}


function setUpExperimentOptionsScreen() {
    const experimentOptionsContainer = document.querySelector('.experiments');

    createExpeprimentButton(
        experimentOptionsContainer,
        'A',
        EXPERIMENT_TYPE.CIRCLE,
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