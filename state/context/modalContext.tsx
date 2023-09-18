"use client";

import {
   useState,
   createContext,
   ReactNode,
   SetStateAction,
   Dispatch,
} from "react";

export interface ModalContextProp {
   toggleWelcomeFormModal: () => void;
   toggleJoinFormModal: () => void;
   toggleEmailFormModal: () => void;
   openModal: boolean;
   openJoinModal: boolean;
   openEmailCompModal: boolean;
   setOpenModal: Dispatch<SetStateAction<boolean>>;
   setOpenJoinModal: Dispatch<SetStateAction<boolean>>;
   setOpenEmailCompModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalContextProp | null>(null);

export default function ModalContextProvider({
   children,
}: {
   children: ReactNode;
}) {
   const [openModal, setOpenModal] = useState(false);
   const [openJoinModal, setOpenJoinModal] = useState(false);
   const [openEmailCompModal, setOpenEmailCompModal] = useState(false);

   const toggleWelcomeFormModal = () => {
      setOpenModal((prev) => !prev);
   };
   const toggleJoinFormModal = () => {
      setOpenJoinModal((prev) => !prev);
   };
   const toggleEmailFormModal = () => {
      setOpenEmailCompModal((prev) => !prev);
   };

   return (
      <ModalContext.Provider
         value={{
            setOpenEmailCompModal,
            openEmailCompModal,
            toggleEmailFormModal,
            toggleWelcomeFormModal,
            openModal,
            setOpenModal,
            openJoinModal,
            setOpenJoinModal,
            toggleJoinFormModal,
         }}>
         {children}
      </ModalContext.Provider>
   );
}
