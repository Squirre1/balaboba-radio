import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function BalabobaRadio() {

    const [started, setStarted] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const synthesis = window.speechSynthesis
        const voices = synthesis.getVoices()

        const russianVoice = voices.find(({ lang }) => lang === 'ru-RU')

        let isPlaying = false

        let r: any

        const getBalabobaText = async (text: string) => {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.voice = russianVoice!
            synthesis.speak(utterance)

            isPlaying = true

            r = setInterval(() => {
                synthesis.pause()
                synthesis.resume()
            }, 3000)

            utterance.onend = async () => {
                isPlaying = false

                const parts = text.split(' ')

                try {
                    setLoading(true)

                    const response = await fetch('https://zeapi.yandex.net/lab/api/yalm/text3', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "query": parts[Math.floor(Math.random() * parts.length)],
                            // Balaboba styles
                            "intro": Math.floor(Math.random() * (11 - 0 + 1)) + 0,
                            "filter": 1
                        })
                    });
                    
                    const result = await response.json()

                    getBalabobaText(result.text)
                } finally {
                    setLoading(false)
                }
            }
        }

        if (started) {
            getBalabobaText("Вас приветствует балабоба радио!")
        }

        return () => {
            synthesis.cancel()
            clearInterval(r)
        }

    }, [started])

    return (
        <>
            <div className={styles.grid}>
                <h1 className={styles.title}>
                    Welcome to Balaboba radio
                </h1>
                {!started ? (
                    <div
                        className={styles.card}
                        onClick={() => setStarted(true)}
                    >
                        <h2 className={styles.title}>Start</h2>
                    </div>
                ) : (
                    <div className={styles.card}>
                        <p>
                            Здесь Балабоба просто генерирует и произносит текст 
                        </p>
                    </div>
                )}
            </div>

            {loading && (
                <div className={styles.loader}></div>
            )}
        </>
    )
}
