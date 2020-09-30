import styles from '../styles.css'

let stylesheet = undefined

const Gist = ({ attributes: { url }}) => {
    
    const container = <div className={styles.gist}/>

    function callback(gistData) {
        if (stylesheet == undefined) {
            stylesheet = gistData.stylesheet
            const link = <link rel="stylesheet" href={stylesheet} />
            document.body.appendChild(link)
        }
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