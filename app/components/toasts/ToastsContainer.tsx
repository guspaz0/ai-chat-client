import React from 'react'
import { useWindowContext } from '../window/WindowContext'
import Toast from './Toast'

export default function ToastManager(){

    const Toasts = useWindowContext().toasts

    function handleClose(id: string){
        Toasts.value = Toasts.value.filter(toast => toast.id !== id)
    }

    return(
    <div className="toasts-container">
        {Toasts.value.slice(-10).map((toast,i) =>
            <Toast key={"toast"+i}
                id={toast.id}
                message={toast.message}
                data={toast.data}
                onClose={handleClose}
            />
        )}
    </div>)
}
