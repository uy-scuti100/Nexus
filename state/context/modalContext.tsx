import {
   useState,
   createContext,
   ReactNode,
   SetStateAction,
   Dispatch,
} from "react";

export interface ModalContextProp {
   toggleFormModal: () => void;
   toggleJoinFormModal: () => void;
   openModal: boolean;
   openJoinModal: boolean;
   setOpenModal: Dispatch<SetStateAction<boolean>>;
   setOpenJoinModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalContextProp | null>(null);

export default function ModalContextProvider({
   children,
}: {
   children: ReactNode;
}) {
   const [openModal, setOpenModal] = useState(false);
   const [openJoinModal, setOpenJoinModal] = useState(false);

   const toggleFormModal = () => {
      // console.log("clicked");
      setOpenModal((prev) => !prev);
   };
   const toggleJoinFormModal = () => {
      // console.log("clicked");
      setOpenJoinModal((prev) => !prev);
   };

   return (
      <ModalContext.Provider
         value={{
            toggleFormModal,
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
