import styles from './styles.css'

const container = <div className={styles.gist}/>

function callback(gistData) {
    var styleSheet = <link rel="stylesheet" href={gistData.stylesheet} />
    document.body.appendChild(styleSheet)
    
    container.innerHTML = gistData.div
    
}

const callbackName = callback.name
window[callbackName] = callback

const script = document.createElement('script')
script.setAttribute('src', `https://gist.github.com/ScottORLY/c0c711b22d7d19e5c68ddcfc98c42620.json?file=drive.swift&callback=${callbackName}`)
document.body.appendChild(script)

document.body.appendChild(
    <div id={styles.app}>
        <h1>Drive</h1>
        <p>Functional Reactive Form Validation with RxSwift</p>
        {container}
    </div>
)