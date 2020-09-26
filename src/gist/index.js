import styles from '../styles.css'

const Gist = ({ attributes: { url }}) => {
    const container = <div className={styles.gist}/>

    function callback(gistData) {
        var styleSheet = <link rel="stylesheet" href={gistData.stylesheet} />
        document.body.appendChild(styleSheet)
        container.innerHTML = gistData.div
    }
    
    const callbackName = `callback${Math.floor(Math.random() * Math.floor(1e5))}`
    window[callbackName] = callback
    
    const script = document.createElement('script')
    script.setAttribute('src', `${url}&callback=${callbackName}`)
    document.body.appendChild(script)
    return container
}

export default Gist