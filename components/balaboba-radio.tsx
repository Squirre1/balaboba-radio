import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

const randomText = `
    Слушайте мою клятву и будьте свидетелями моего обета!
    Ночь собирается, и начинается мой дозор.
    Он не окончится до самой моей смерти.
    Я не возьму себе ни жены, ни земель, не буду отцом детям.
    Я не надену корону и не буду добиваться славы.
    Я буду жить и умру на своём посту.
    Я — меч во тьме; Я — дозорный на Стене;
    Я — щит, который охраняет царство людей.
    Я отдаю свою жизнь и честь Ночному Дозору в эту ночь и во все грядущие!
`

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

                const parts = text ? text.split(' ') : randomText.split(' ')

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
