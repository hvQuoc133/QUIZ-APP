import { useEffect, useState } from "react";

const CountDown = (props) => {

    const [count, setCount] = useState(300);
 
    useEffect(() => {
        if(count === 0) {
            props.onTimeUp();
            return;
        }
        const timer = setInterval(() => {
            setCount(count - 1)
        }, 1000)

        //clean up
        return () =>{
            clearInterval(timer);
        }
    }, [count])

    const convertSecondsToTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0')
        ].join(':');
    };

    return(
        <div className="countdown-container">
            {convertSecondsToTime(count)}
        </div>
    )
}
export default CountDown;