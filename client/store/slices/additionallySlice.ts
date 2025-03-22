import { AdditionallyState } from '@types-my/redux-type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const additionallyState: AdditionallyState = {
    isOpen: false,
    isSend: false,
    isShow: false,
    updateCount: 0
}

const additionallySlice = createSlice({
    name: "additionally",
    initialState: additionallyState,
    reducers: {
        setIsOpen (state, action: PayloadAction<boolean>) {
            state.isOpen = action.payload
        },
        setIsSend (state, action: PayloadAction<boolean>) {
            state.isSend = action.payload
        },
        setIsShow (state, action: PayloadAction<boolean>) {
            state.isShow = action.payload
        },
        plusUpdateCount (state) {
            state.updateCount = state.updateCount + 1
        }
    }
})

export const { setIsOpen, setIsSend, setIsShow, plusUpdateCount } = additionallySlice.actions;

export default additionallySlice.reducer;