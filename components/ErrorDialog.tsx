"use client";

import { useEffect } from "react";

type Props = {
  dialogRef: React.RefObject<HTMLDialogElement>;
};

function ErrorDialog({ dialogRef }: Props) {
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [dialogRef]);

  return (
    <dialog open={false} ref={dialogRef} className="rounded-lg p-12">
      <h1 className="text-center mb-6 font-semibold text-red-600 text-2xl">
        Error
      </h1>
      <button
        className="border-1 border-black bg-slate-300 rounded-md font-semibold px-2 py-1"
        onClick={() => {
          dialogRef.current?.close();
        }}
      >
        Close
      </button>
    </dialog>
  );
}

export default ErrorDialog;
