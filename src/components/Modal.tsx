'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './modal.module.css';

export default function Modal({ children, onClose, labelledBy, wide = false }: {
  children: ReactNode; onClose: () => void; labelledBy: string; wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={ref} aria-labelledby={labelledBy} className={`${styles.modal} ${wide ? styles.wide : ''}`}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) {
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
    } }}>
    {children}
  </dialog>;
}
