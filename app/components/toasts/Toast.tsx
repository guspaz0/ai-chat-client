import React from 'react'
import { useWindowContext } from '../window/WindowContext'
import { useSignal, useSignalEffect } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'

type Props = {
    id: number,
    message: string
    data?: string
    bgcolor?: string
    fontsize?: string
    timelimit?: number
    onClose: Function
}

export default function Toast({id, message, timelimit= 8, data, onClose, bgcolor, fontsize}: Props){
    if (!timelimit) timelimit = 8
    useSignals()

    const counter = useSignal<number>(timelimit)

    let timerInterval: NodeJS.Timeout;

    function interval() {
      const TIME_LIMIT = timelimit
      let timePassed = 0
      let timeLeft;
      timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        counter.value = timePassed;
      }, 1000);
    }

    interval()

    useSignalEffect(()=> {
        if (counter.value == 0) {
            clearInterval(timerInterval as NodeJS.Timeout)
            onClose(id)
        }
    })

    return(
        <div
            onClick={()=>clearInterval(timerInterval as NodeJS.Timeout)}
            style={{backgroundColor: bgcolor, fontSize: fontsize}}
            className='Toast'
        >
            <details>
              <summary>{message}-{counter.value}</summary>
                <p>{data}</p>
            </details>
        </div>
    )
}
