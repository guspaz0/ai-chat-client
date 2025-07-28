import { useRef } from 'react'
import { useWindowContext } from './window/WindowContext'
import { type Signal, useSignalEffect } from '@preact/signals-react'

type Props = {
  id: number
  position?: 'relative' | 'absolute' | 'fixed'
  content: any
  buttonText: React.ReactNode
  reference?: React.RefAttributes<HTMLDialogElement>
}

export const Dialog = ({ id, buttonText, content, position, reference }: Props) => {
  
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogsGen: Signal<Record<string, any>[]> = useWindowContext().dialogs // estado global de dialogs

  const openDialog = () => {
    const exists = dialogsGen.value.find((e) => e.id === id)
    if (exists) {
      dialogsGen.value = [...dialogsGen.value.filter(e => e.id !== id), { ...exists, open: true }]
    } else {
      dialogsGen.value = [...dialogsGen.value, { id, open: true }]
    }
  }

  const closeDialog = () => {
    const exists = dialogsGen.value.find((e) => e.id === id)
    if (exists) {
        dialogsGen.value = [
            ...dialogsGen.value.filter(e => e.id !== id), 
            {...exists, open: false}
        ]
    }

  }
  useSignalEffect(() => {
    if (dialogsGen.value.some((e) => e.id == id)) {
      const modalState = dialogsGen.value.find((e) => e.id == id) as Record<string, any>
      if (modalState.open) dialogRef.current?.showModal()
      else dialogRef.current?.close()
    }
  })

  const lang = navigator.language.startsWith('en')? 'en' : 'es';

  return (
    <div id={String(Math.random())}>
      <button id="open" 
        className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
        onClick={openDialog}
      >
        {buttonText}
      </button>
      <div className="dialog-container">
        <dialog className="popover p-4 bg-gray-700 rounded-lg border-gray-600" ref={dialogRef}>
          {content}
          <button id="close" 
            className='mt-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors'
            onClick={closeDialog}>
            {lang == 'en'? 'Close': 'Cerrar'}
          </button>
        </dialog>
      </div>
    </div>
  )
}
